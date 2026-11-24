/**
 * Cryptographic Benchmark & Demo Controller
 */

const cryptoService = require("../services/crypto.service");

class CryptoController {
  demoEncrypt(req, res, next) {
    try {
      const { aadhaar, phone, email, pan } = req.body;
      const result = cryptoService.encryptAndMaskDemo({ aadhaar, phone, email, pan });
      return res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  getProtectedData(req, res, next) {
    try {
      const { principalId } = req.params;
      const data = cryptoService.getProtectedDemoRecord(principalId, req.dpdpConsent);
      return res.json({
        success: true,
        accessGrantedUnderDPDP: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CryptoController();
