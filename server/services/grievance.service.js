/**
 * Grievance Redressal Service (Section 13)
 */

const crypto = require("node:crypto");
const db = require("../database/db");

class GrievanceService {
  async submitGrievance({ tenantId = "ASCII_GROUP", principalId, complaintSummary }) {
    const ticketId = "GRV-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await db.insert("dpdp_grievance_tickets", {
      ticket_id: ticketId,
      tenant_id: tenantId,
      principal_id: String(principalId),
      complaint_summary: complaintSummary,
      ticket_status: "OPEN",
      dpo_response_text: null,
      sla_deadline: deadline,
      submitted_at: new Date().toISOString()
    });

    return {
      ticketId,
      status: "OPEN",
      slaDeadline: deadline,
      dpbiEscalationUrl: "https://dpbi.gov.in/escalation/grievance"
    };
  }

  async getAllTickets(tenantId = "ASCII_GROUP") {
    return await db.all("dpdp_grievance_tickets", t => t.tenant_id === tenantId);
  }

  async updateTicket(ticketId, { status, dpoResponseText }) {
    const updates = {};
    if (status !== undefined) updates.ticket_status = status;
    if (dpoResponseText !== undefined) updates.dpo_response_text = dpoResponseText;

    const count = await db.update(
      "dpdp_grievance_tickets",
      t => t.ticket_id === ticketId,
      updates
    );

    if (count === 0) return null;
    return await db.get("dpdp_grievance_tickets", t => t.ticket_id === ticketId);
  }
}

module.exports = new GrievanceService();
