/**
 * Grievance Redressal Controller
 */

const grievanceService = require("../services/grievance.service");

class GrievanceController {
  async submit(req, res, next) {
    try {
      const { tenantId = "ASCII_GROUP", principalId, complaintSummary } = req.body;
      if (!principalId || !complaintSummary) {
        return res.status(400).json({ success: false, message: "Missing principalId or complaintSummary" });
      }

      const result = await grievanceService.submitGrievance({ tenantId, principalId, complaintSummary });
      return res.status(201).json({
        success: true,
        message: "Grievance ticket filed under Section 13 of DPDP Act 2023",
        ticket: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const tickets = await grievanceService.getAllTickets(tenantId);
      return res.json({ success: true, count: tickets.length, tickets });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { ticketId } = req.params;
      const { status, dpoResponseText } = req.body;
      const updated = await grievanceService.updateTicket(ticketId, { status, dpoResponseText });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Ticket not found" });
      }
      return res.json({ success: true, ticket: updated });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GrievanceController();
