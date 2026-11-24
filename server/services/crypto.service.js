/**
 * Cryptographic Demonstration & Security Benchmark Service (Section 8(5))
 */

const aes = require("../utils/aes");
const blindIndex = require("../utils/blindIndex");
const masking = require("../utils/masking");

class CryptoService {
  encryptAndMaskDemo({ aadhaar, phone, email, pan }) {
    const encryptedAadhaar = aes.encrypt(aadhaar);
    const encryptedPhone = aes.encrypt(phone);
    const phoneBlindIndex = blindIndex.generateBlindIndex(phone);

    return {
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
    };
  }

  getProtectedDemoRecord(principalId, complianceProof) {
    return {
      principalId,
      name: "DPDP Verified Principal",
      aadhaar: masking.maskAadhaar("987654321234"),
      mobile: masking.maskMobile("9820098765"),
      email: masking.maskEmail("verified.principal@example.com"),
      complianceProof
    };
  }
}

module.exports = new CryptoService();
