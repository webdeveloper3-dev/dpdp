/**
 * ====================================================================
 * CRYPTOGRAPHIC DEMO & CLIENT BENCHMARK API (SECTION 8(5))
 * ====================================================================
 * Interactive testing endpoint for AES-256-GCM encryption, blind indexing,
 * dynamic data masking, and middleware consent verification.
 */

const { express } = require("../lib/express");
const router = express.Router();
const aes = require("../crypto/aes");
const blindIndex = require("../crypto/blindIndex");
const masking = require("../crypto/masking");
const { dpdpConsentGuard } = require("../middleware/consentGuard");

// POST /api/dpdp/crypto/demo-encrypt
router.post("/demo-encrypt", (req, res) => {
  try {
    const { aadhaar, phone, email, pan } = req.body;

    const encryptedAadhaar = aes.encrypt(aadhaar);
    const encryptedPhone = aes.encrypt(phone);
    const phoneBlindIndex = blindIndex.generateBlindIndex(phone);

    return res.json({
      success: true,
      input: { aadhaar, phone, email, pan },
      encryptedAtRest: {
        aadhaarCiphertext: encryptedAadhaar,
        phoneCiphertext: encryptedPhone,
        phoneBlindIndex: phoneBlindIndex
      },
      maskedForNonAdmins: {
        aadhaar: masking.maskAadhaar(aadhaar),
        phone: masking.maskMobile(phone),
        pan: masking.maskPAN(pan),
        email: masking.maskEmail(email)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/crypto/protected-data/:principalId (Protected with dpdpConsentGuard)
router.get(
  "/protected-data/:principalId",
  dpdpConsentGuard({ purposeCode: "CORE_SERVICE" }),
  (req, res) => {
    // Reached only if user has active consent for CORE_SERVICE!
    const sampleRecord = {
      principalId: req.params.principalId,
      name: "Gopal Gawas",
      aadhaar: masking.maskAadhaar("987654321234"),
      mobile: masking.maskMobile("9820098765"),
      email: masking.maskEmail("gopal.gawas@example.com"),
      complianceProof: req.dpdpConsent
    };

    return res.json({
      success: true,
      message: "Data Principal active consent verified by dpdpConsentGuard middleware",
      data: sampleRecord
    });
  }
);

module.exports = router;
