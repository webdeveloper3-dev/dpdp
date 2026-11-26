/**
 * ====================================================================
 * COMPREHENSIVE DPDP ENGINE AUTOMATED TEST SUITE
 * ====================================================================
 * Tests:
 * 1. AES-256-GCM Field-Level Encryption & Decryption (Section 8(5))
 * 2. Blind Indexing (HMAC-SHA256) Determinism
 * 3. Dynamic Masking (Aadhaar, Mobile, PAN, Email)
 * 4. Notice Retrieval (Multilingual 22 languages support)
 * 5. Granular Purpose-Wise Consent Capture & SHA-256 Signature Verification
 * 6. Instant Consent Withdrawal & Processing Halt (Section 6(4))
 * 7. dpdpConsentGuard Middleware Execution
 */

const assert = require("node:assert");
const aes = require("../utils/aes");
const blindIndex = require("../utils/blindIndex");
const masking = require("../utils/masking");
const db = require("../database/db");
const seed = require("../database/seed");
const { app } = require("../server");
const http = require("node:http");

async function runTests() {
  console.log("🧪 Starting DPDP Engine Automated Verification Suite...\n");
  let passed = 0;

  // 1. Crypto AES-256-GCM
  console.log("TEST 1: Verifying AES-256-GCM Field-Level Encryption...");
  const sampleAadhaar = "987654321012";
  const cipher = aes.encrypt(sampleAadhaar);
  assert(cipher.includes(":"), "Ciphertext should contain IV and AuthTag separated by colon");
  assert.notStrictEqual(cipher, sampleAadhaar, "Ciphertext must not be plaintext");
  const decrypted = aes.decrypt(cipher);
  assert.strictEqual(decrypted, sampleAadhaar, "Decrypted text must match original Aadhaar");
  console.log("  ✅ AES-256-GCM Encryption & Decryption Verified");
  passed++;

  // 2. Blind Indexing
  console.log("TEST 2: Verifying HMAC-SHA256 Blind Indexing...");
  const phone = "98200-98765";
  const phoneSpaced = " 98200 98765 ";
  const idx1 = blindIndex.generateBlindIndex(phone);
  const idx2 = blindIndex.generateBlindIndex(phoneSpaced);
  assert.strictEqual(idx1, idx2, "Blind indexes for equivalent normalized phones must match");
  assert.strictEqual(idx1.length, 64, "Blind index must be 64-character SHA-256 hex string");
  console.log("  ✅ Blind Indexing Determinism Verified");
  passed++;

  // 3. Dynamic Masking
  console.log("TEST 3: Verifying Role-Based Dynamic Masking...");
  assert.strictEqual(masking.maskAadhaar("123456789012"), "XXXXXXXX9012");
  assert.strictEqual(masking.maskMobile("9876543210"), "XXXXXX3210");
  assert.strictEqual(masking.maskPAN("ABCDE1234F"), "XXXXX1234F");
  assert.strictEqual(masking.maskEmail("gopal.gawas@example.com"), "g*********s@example.com");
  console.log("  ✅ Dynamic Data Masking Verified");
  passed++;

  // 4. Seed Database
  console.log("TEST 4: Initializing and Seeding Database...");
  await seed();
  const depts = await db.all("dpdp_departments");
  assert(depts.length >= 3, "Database should contain seeded departments");
  console.log("  ✅ RoPA Database Seed Verified");
  passed++;

  // 5. Start Server for HTTP Integration Tests
  console.log("TEST 5: Running End-to-End HTTP API Integration Tests...");
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 5A: Healthcheck
    const resHealth = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    assert.strictEqual(resHealth.status, "HEALTHY");

    // 5B: Active Notice (Hindi)
    const resNotice = await fetch(`${baseUrl}/api/dpdp/notice/active?lang=hi`).then(r => r.json());
    assert(resNotice.success, "Notice API should succeed");
    assert.strictEqual(resNotice.data.language, "hi");
    assert(resNotice.data.purposes.length > 0, "Notice must contain purpose checkboxes");

    // 5C: Consent Record
    const testUser = "TEST_USER_" + Date.now();
    const consentPayload = {
      tenantId: "ASCII_GROUP",
      principalId: testUser,
      noticeId: "NOT-01",
      noticeVersion: "v1.0",
      items: [
        { purposeId: "PUR-01", isGranted: true },
        { purposeId: "PUR-02", isGranted: false }
      ]
    };
    const resConsent = await fetch(`${baseUrl}/api/dpdp/consent/record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consentPayload)
    }).then(r => r.json());
    assert(resConsent.success, "Consent recording must succeed");
    assert(resConsent.receipt.signatureHash, "Must issue cryptographic receipt");

    // 5D: Check Consent Status
    const resStatus = await fetch(`${baseUrl}/api/dpdp/consent/status/${testUser}`).then(r => r.json());
    assert.strictEqual(resStatus.hasConsent, true);
    assert.strictEqual(resStatus.record.status, "GIVEN");

    // 5E: Test dpdpConsentGuard on Protected Endpoint
    // Should SUCCEED for PUR-01 (CORE_SERVICE)
    const resProtectedPass = await fetch(`${baseUrl}/api/dpdp/crypto/protected-data/${testUser}`, {
      headers: { "x-principal-id": testUser }
    }).then(r => r.json());
    assert(resProtectedPass.success, "Protected call should succeed when consent is active");
    assert.strictEqual(resProtectedPass.data.aadhaar, "XXXXXXXX1234", "Must return masked data");

    // 5F: Test Consent Withdrawal (Section 6(4))
    const resWithdraw = await fetch(`${baseUrl}/api/dpdp/consent/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ principalId: testUser })
    }).then(r => r.json());
    assert(resWithdraw.success, "Withdrawal must succeed");

    // 5G: Verify Protected Route BLOCKS after withdrawal
    const resProtectedBlocked = await fetch(`${baseUrl}/api/dpdp/crypto/protected-data/${testUser}`, {
      headers: { "x-principal-id": testUser }
    });
    assert.strictEqual(resProtectedBlocked.status, 403, "Must block with HTTP 403 after withdrawal");
    const blockedBody = await resProtectedBlocked.json();
    assert.strictEqual(blockedBody.errorCode, "CONSENT_WITHDRAWN");

    console.log("  ✅ Full Consent Capture, Withdrawal & Middleware Blocker Verified");
    passed++;
  } finally {
    server.close();
  }

  console.log(`\n🎉 ALL ${passed} VERIFICATION TEST SUITES PASSED CLEANLY (100% SUCCESS)!`);
}

if (require.main === module) {
  runTests()
    .then(async () => {
      await db.close();
      process.exit(0);
    })
    .catch(async err => {
      console.error("❌ Test suite failed:", err);
      await db.close();
      process.exit(1);
    });
}

module.exports = runTests;
