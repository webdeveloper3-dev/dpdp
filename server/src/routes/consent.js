/**
 * ====================================================================
 * CONSENT CAPTURE & WITHDRAWAL API (FORM 13, SECTION 6)
 * ====================================================================
 * Records itemized unbundled consent with SHA-256 digital receipts
 * and handles instant 1-click withdrawal under Section 6(4).
 */

const { express } = require("../lib/express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../database/db");

// POST /api/dpdp/consent/record
router.post("/record", async (req, res) => {
  try {
    const {
      tenantId = "ASCII_GROUP",
      principalId,
      noticeId,
      noticeVersion,
      items = [], // Array of { purposeId: "PUR-01", isGranted: true }
      isMinor = false,
      guardianPrincipalId = null
    } = req.body;

    if (!principalId || !noticeId || !noticeVersion) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory fields: principalId, noticeId, noticeVersion"
      });
    }

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Client Application";
    const timestamp = new Date().toISOString();

    // 1. Generate SHA-256 Cryptographic Digital Receipt Signature
    const signaturePayload = `${principalId}|${noticeId}|${noticeVersion}|${timestamp}|${JSON.stringify(items)}|dpdp_salt_2026`;
    const signatureHash = crypto.createHash("sha256").update(signaturePayload).digest("hex");

    // 2. Insert Master Consent Record (Header)
    const consentRecord = await db.insert("dpdp_consent_records", {
      tenant_id: tenantId,
      principal_id: String(principalId),
      notice_id: noticeId,
      notice_version: noticeVersion,
      consent_status: "GIVEN",
      ip_address: ipAddress,
      user_agent: userAgent,
      consent_signature_hash: signatureHash,
      is_minor: Boolean(isMinor),
      guardian_principal_id: guardianPrincipalId,
      given_at: timestamp,
      withdrawn_at: null
    });

    // 3. Insert Granular Purpose-Wise Line Items (Section 6 unbundled)
    const insertedItems = [];
    for (const item of items) {
      const lineItem = await db.insert("dpdp_consent_items", {
        consent_id: consentRecord.consent_id,
        purpose_id: item.purposeId,
        is_granted: Boolean(item.isGranted)
      });
      insertedItems.push(lineItem);
    }

    return res.status(201).json({
      success: true,
      message: "Consent successfully recorded under Section 6 of DPDP Act 2023",
      receipt: {
        consentId: consentRecord.consent_id,
        principalId: consentRecord.principal_id,
        noticeVersion,
        signatureHash,
        givenAt: consentRecord.given_at,
        grantedPurposes: insertedItems.filter(i => i.is_granted).map(i => i.purpose_id)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dpdp/consent/withdraw (Section 6(4))
router.post("/withdraw", async (req, res) => {
  try {
    const { tenantId = "ASCII_GROUP", principalId, purposeId } = req.body;

    if (!principalId) {
      return res.status(400).json({ success: false, message: "Missing principalId" });
    }

    const timestamp = new Date().toISOString();

    // Find latest active consent record
    const consents = await db.all("dpdp_consent_records", c => 
      c.tenant_id === tenantId && c.principal_id === String(principalId)
    );

    if (consents.length === 0) {
      return res.status(404).json({ success: false, message: "No active consent found to withdraw" });
    }

    consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at));
    const latestConsent = consents[0];

    // If withdrawing a specific purpose
    if (purposeId) {
      await db.update(
        "dpdp_consent_items",
        item => item.consent_id === latestConsent.consent_id && item.purpose_id === purposeId,
        { is_granted: false }
      );
    } else {
      // Withdrawing all consent
      await db.update(
        "dpdp_consent_records",
        c => c.consent_id === latestConsent.consent_id,
        { consent_status: "WITHDRAWN", withdrawn_at: timestamp }
      );
      await db.update(
        "dpdp_consent_items",
        item => item.consent_id === latestConsent.consent_id,
        { is_granted: false }
      );
    }

    return res.json({
      success: true,
      message: "Consent successfully withdrawn under Section 6(4). Processing halted.",
      withdrawalReceipt: {
        consentId: latestConsent.consent_id,
        principalId,
        purposeWithdrawn: purposeId || "ALL_PURPOSES",
        withdrawnAt: timestamp,
        status: purposeId ? "PARTIALLY_WITHDRAWN" : "WITHDRAWN"
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/consent/status/:principalId
router.get("/status/:principalId", async (req, res) => {
  try {
    const { principalId } = req.params;
    const tenantId = req.query.tenant_id || "ASCII_GROUP";

    const consents = await db.all("dpdp_consent_records", c => 
      c.tenant_id === tenantId && c.principal_id === String(principalId)
    );

    if (consents.length === 0) {
      return res.json({ success: true, hasConsent: false, activeConsents: [] });
    }

    consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at));
    const latest = consents[0];

    const items = await db.all("dpdp_consent_items", item => item.consent_id === latest.consent_id);
    const purposes = await db.all("dpdp_purposes", p => p.tenant_id === tenantId);

    const detailedItems = items.map(item => {
      const p = purposes.find(x => x.purpose_id === item.purpose_id);
      return {
        purposeId: item.purpose_id,
        purposeCode: p ? p.purpose_code : item.purpose_id,
        description: p ? p.purpose_description : "",
        isGranted: !!item.is_granted
      };
    });

    return res.json({
      success: true,
      hasConsent: latest.consent_status === "GIVEN",
      record: {
        consentId: latest.consent_id,
        status: latest.consent_status,
        noticeVersion: latest.notice_version,
        givenAt: latest.given_at,
        withdrawnAt: latest.withdrawn_at,
        signature: latest.consent_signature_hash,
        items: detailedItems
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
