/**
 * ====================================================================
 * GRIEVANCE REDRESSAL API (SECTION 13)
 * ====================================================================
 * Tracks user privacy grievances with mandatory 30-day SLA countdown
 * and direct escalation link to the Data Protection Board of India (DPBI).
 */

const { express } = require("../lib/express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../database/db");

// POST /api/dpdp/grievance/submit
router.post("/submit", async (req, res) => {
  try {
    const { tenantId = "ASCII_GROUP", principalId, complaintSummary } = req.body;

    if (!principalId || !complaintSummary) {
      return res.status(400).json({ success: false, message: "Missing principalId or complaintSummary" });
    }

    const ticketId = "GRV-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const ticket = await db.insert("dpdp_grievance_tickets", {
      ticket_id: ticketId,
      tenant_id: tenantId,
      principal_id: String(principalId),
      complaint_summary: complaintSummary,
      ticket_status: "OPEN",
      dpo_response_text: null,
      sla_deadline: deadline,
      submitted_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: "Grievance ticket filed under Section 13 of DPDP Act 2023",
      ticket: {
        ticketId,
        status: "OPEN",
        slaDeadline: deadline,
        dpbiEscalationUrl: "https://dpbi.gov.in/escalation/grievance"
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/grievance/tickets
router.get("/tickets", async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || "ASCII_GROUP";
    const tickets = await db.all("dpdp_grievance_tickets", t => t.tenant_id === tenantId);
    return res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dpdp/grievance/resolve
router.post("/resolve", async (req, res) => {
  try {
    const { ticketId, dpoResponseText, status = "RESOLVED" } = req.body;

    const ticket = await db.get("dpdp_grievance_tickets", t => t.ticket_id === ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Grievance ticket not found" });
    }

    await db.update(
      "dpdp_grievance_tickets",
      t => t.ticket_id === ticketId,
      {
        dpo_response_text: dpoResponseText,
        ticket_status: status,
        resolved_at: new Date().toISOString()
      }
    );

    return res.json({
      success: true,
      message: "Grievance ticket updated by DPO",
      ticketId,
      status
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
