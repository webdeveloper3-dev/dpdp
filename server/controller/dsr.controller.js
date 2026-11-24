/**
 * Data Subject Rights (DSR) Controller
 */

const dsrService = require("../services/dsr.service");

class DsrController {
  async submit(req, res, next) {
    try {
      const { tenantId = "ASCII_GROUP", principalId, requestType, details } = req.body;
      if (!principalId || !requestType) {
        return res.status(400).json({ success: false, message: "Missing principalId or requestType" });
      }

      const ticket = await dsrService.submitRequest({ tenantId, principalId, requestType, details });
      return res.status(201).json({
        success: true,
        message: `DSR Request ${requestType} registered with statutory 30-day SLA deadline`,
        ticket
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const requests = await dsrService.getAllRequests(tenantId);
      return res.json({ success: true, count: requests.length, requests });
    } catch (err) {
      next(err);
    }
  }

  async exportData(req, res, next) {
    try {
      const { principalId } = req.params;
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const report = await dsrService.executeAccessExport(principalId, tenantId);
      return res.json({ success: true, dataPackage: report });
    } catch (err) {
      next(err);
    }
  }

  async erasure(req, res, next) {
    try {
      const { tenantId = "ASCII_GROUP", principalId, reason } = req.body;
      if (!principalId) {
        return res.status(400).json({ success: false, message: "Missing principalId" });
      }

      const result = await dsrService.executeErasure({ tenantId, principalId, reason });
      if (!result.shredded) {
        return res.status(409).json({
          success: false,
          errorCode: "LEGAL_HOLD_ACTIVE",
          message: result.reason
        });
      }

      return res.json({
        success: true,
        message: "Cryptographic Shredding executed under Section 12(3) Right to Erasure",
        certificate: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DsrController();
