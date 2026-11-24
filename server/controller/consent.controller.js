/**
 * Consent Capture & Withdrawal Controller
 */

const consentService = require("../services/consent.service");

class ConsentController {
  async record(req, res, next) {
    try {
      const {
        tenantId = "ASCII_GROUP",
        principalId,
        noticeId,
        noticeVersion,
        items = [],
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

      const receipt = await consentService.recordConsent({
        tenantId,
        principalId,
        noticeId,
        noticeVersion,
        items,
        isMinor,
        guardianPrincipalId,
        ipAddress,
        userAgent
      });

      return res.status(201).json({
        success: true,
        message: "Consent successfully registered under Section 6 of DPDP Act 2023",
        receipt
      });
    } catch (err) {
      next(err);
    }
  }

  async withdraw(req, res, next) {
    try {
      const { tenantId = "ASCII_GROUP", principalId, reason } = req.body;
      if (!principalId) {
        return res.status(400).json({ success: false, message: "Missing principalId" });
      }

      const result = await consentService.withdrawConsent({ tenantId, principalId, reason });
      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: `No active consents found for principal ${principalId} to withdraw.`
        });
      }

      return res.json({
        success: true,
        message: "Consent revoked with 1-click. Personal data processing must cease immediately under Section 6(4).",
        withdrawal: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getStatus(req, res, next) {
    try {
      const { principalId } = req.params;
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const statusData = await consentService.getStatus(principalId, tenantId);
      return res.json({
        success: true,
        ...statusData
      });
    } catch (err) {
      next(err);
    }
  }

  async verify(req, res, next) {
    try {
      const { hash } = req.params;
      const verified = await consentService.verifyConsent(hash);

      if (!verified) {
        return res.status(404).json({
          success: false,
          valid: false,
          message: "Digital Receipt Signature could not be verified against the ledger"
        });
      }

      return res.json({
        success: true,
        valid: true,
        tamperProofVerified: true,
        record: verified.record,
        lineItems: verified.items
      });
    } catch (err) {
      next(err);
    }
  }

  async history(req, res, next) {
    try {
      const { principalId } = req.params;
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const records = await consentService.getConsentHistory(principalId, tenantId);
      return res.json({ success: true, count: records.length, records });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConsentController();
