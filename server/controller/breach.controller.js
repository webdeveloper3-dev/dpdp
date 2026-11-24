/**
 * Breach Incident Controller
 */

const breachService = require("../services/breach.service");

class BreachController {
  async report(req, res, next) {
    try {
      const { tenantId = "ASCII_GROUP", incidentTitle, severityLevel, affectedCount, remediationSteps } = req.body;
      if (!incidentTitle || !severityLevel) {
        return res.status(400).json({ success: false, message: "Missing incidentTitle or severityLevel" });
      }

      const incident = await breachService.reportIncident({
        tenantId,
        incidentTitle,
        severityLevel,
        affectedCount,
        remediationSteps
      });

      return res.status(201).json({
        success: true,
        message: "Security breach incident logged. 72-hour DPBI notification SLA active.",
        incident
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const incidents = await breachService.getAllIncidents(tenantId);
      return res.json({ success: true, count: incidents.length, incidents });
    } catch (err) {
      next(err);
    }
  }

  async notify(req, res, next) {
    try {
      const { incidentId } = req.params;
      const result = await breachService.notifyDpbi(incidentId);
      if (!result.updated) {
        return res.status(404).json({ success: false, message: "Incident not found" });
      }

      return res.json({
        success: true,
        message: "Mandatory incident report dispatched to Data Protection Board of India (DPBI) and CERT-In",
        reportingReceipt: {
          incidentId,
          reportedAt: result.reportedAt,
          dpbiReceiptNumber: result.dpbiReceiptNumber
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BreachController();
