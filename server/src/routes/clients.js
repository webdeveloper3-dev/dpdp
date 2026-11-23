/**
 * ====================================================================
 * MULTI-TENANT CLIENT MANAGEMENT API (ASCII SERVICE ARCHITECTURE)
 * ====================================================================
 * Allows ASCII Online Solutions (Master Service Provider) to manage
 * multiple enterprise clients (Tenants), their DPO profiles, API keys,
 * and compliance environments.
 */

const { express } = require("../lib/express");
const router = express.Router();
const crypto = require("node:crypto");
const db = require("../../database/db");

// GET /api/dpdp/clients - List all enterprise clients
router.get("/", async (req, res) => {
  try {
    const clients = await db.all("dpdp_clients");
    return res.json({ success: true, count: clients.length, clients });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/clients/:tenantId - Get specific client details with stats
router.get("/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const client = await db.get("dpdp_clients", c => c.tenant_id === tenantId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Compute tenant compliance stats
    const depts = await db.all("dpdp_departments", d => d.tenant_id === tenantId);
    const procs = await db.all("dpdp_business_processes", p => p.tenant_id === tenantId);
    const catalog = await db.all("dpdp_data_catalog", c => c.tenant_id === tenantId);
    const notices = await db.all("dpdp_notices", n => n.tenant_id === tenantId);
    const consents = await db.all("dpdp_consent_records", c => c.tenant_id === tenantId);
    const dsr = await db.all("dpdp_dsr_requests", d => d.tenant_id === tenantId);
    const grievances = await db.all("dpdp_grievance_tickets", g => g.tenant_id === tenantId);

    return res.json({
      success: true,
      client,
      stats: {
        departmentsCount: depts.length,
        processesCount: procs.length,
        catalogCount: catalog.length,
        noticesCount: notices.length,
        consentsCount: consents.length,
        activeConsentsCount: consents.filter(c => c.consent_status === "GIVEN").length,
        dsrCount: dsr.length,
        openDsrCount: dsr.filter(d => d.request_status === "SUBMITTED" || d.request_status === "IN_REVIEW").length,
        grievancesCount: grievances.length,
        openGrievancesCount: grievances.filter(g => g.ticket_status === "OPEN").length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dpdp/clients - Onboard a new enterprise client
router.post("/", async (req, res) => {
  try {
    const {
      clientName,
      entityName,
      industry,
      cin,
      pan,
      dpoName,
      dpoEmail,
      dpoPhone
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ success: false, message: "Client Name is required" });
    }

    const tenantId = (clientName.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "_" + crypto.randomBytes(2).toString("hex").toUpperCase()).slice(0, 32);
    const apiKey = "dpdp_live_" + crypto.randomBytes(16).toString("hex");

    const newClient = await db.insert("dpdp_clients", {
      tenant_id: tenantId,
      client_name: clientName,
      entity_name: entityName || clientName + " Pvt. Ltd.",
      industry: industry || "Information Technology",
      cin: cin || "U72200MH2024PTC123456",
      pan: pan || "ABCDE1234F",
      dpo_name: dpoName || "Appointed DPO",
      dpo_email: dpoEmail || `dpo@${tenantId.toLowerCase()}.com`,
      dpo_phone: dpoPhone || "+91 98200 00000",
      api_key: apiKey,
      status: "ACTIVE",
      created_at: new Date().toISOString()
    });

    // Automatically initialize default baseline Forms for this new client!
    await db.insert("dpdp_departments", {
      tenant_id: tenantId,
      department_id: "DEP-01",
      department_name: "Administration & Operations",
      department_head_name: dpoName || "DPO",
      department_head_email: dpoEmail || "admin@company.com"
    });

    await db.insert("dpdp_purposes", {
      tenant_id: tenantId,
      purpose_id: "PUR-01",
      purpose_code: "CORE_SERVICE",
      purpose_description: "Providing core digital services, authentication, and statutory records",
      lawful_basis: "EXPLICIT_CONSENT",
      is_mandatory: true,
      retention_period_months: 36
    });

    await db.insert("dpdp_notices", {
      tenant_id: tenantId,
      notice_id: "NOT-01",
      version_tag: "v1.0",
      language_code: "en",
      notice_title: `${clientName} Privacy Notice (India DPDP Act 2023)`,
      notice_body_markdown: `This notice explains how ${clientName} processes your digital personal data under the DPDP Act 2023.`,
      dpo_name: dpoName || "Appointed DPO",
      dpo_email: dpoEmail || `dpo@company.com`,
      dpo_phone: dpoPhone || "+91 98200 00000",
      is_active: true
    });

    return res.status(201).json({
      success: true,
      message: `Enterprise Client '${clientName}' onboarded successfully into DPDP Engine!`,
      client: newClient
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
