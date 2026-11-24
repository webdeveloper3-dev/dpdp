/**
 * Client (Tenant) Management Service
 */

const crypto = require("node:crypto");
const db = require("../database/db");

class ClientService {
  async getAllClients() {
    return await db.all("dpdp_clients");
  }

  async getClientById(tenantId) {
    const client = await db.get("dpdp_clients", c => c.tenant_id === tenantId);
    if (!client) return null;

    const [depts, procs, catalog, notices, consents, dsr, grievances] = await Promise.all([
      db.all("dpdp_departments", d => d.tenant_id === tenantId),
      db.all("dpdp_business_processes", p => p.tenant_id === tenantId),
      db.all("dpdp_data_catalog", c => c.tenant_id === tenantId),
      db.all("dpdp_notices", n => n.tenant_id === tenantId),
      db.all("dpdp_consent_records", c => c.tenant_id === tenantId),
      db.all("dpdp_dsr_requests", d => d.tenant_id === tenantId),
      db.all("dpdp_grievance_tickets", g => g.tenant_id === tenantId)
    ]);

    return {
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
    };
  }

  async createClient(data) {
    const { clientName, entityName, industry, cin, pan, dpoName, dpoEmail, dpoPhone } = data;
    const tenantId =
      "TENANT_" +
      clientName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "_")
        .slice(0, 16);
    const apiKey = "dpdp_live_" + crypto.randomBytes(16).toString("hex");

    const record = await db.insert("dpdp_clients", {
      tenant_id: tenantId,
      client_name: clientName,
      entity_name: entityName || clientName,
      industry: industry || "Information Technology",
      cin: cin || "",
      pan: pan || "",
      dpo_name: dpoName || "Designated DPO",
      dpo_email: dpoEmail || `dpo@${clientName.toLowerCase().replace(/\s+/g, "")}.com`,
      dpo_phone: dpoPhone || "+91-98000-00000",
      api_key: apiKey,
      is_active: true,
      created_at: new Date().toISOString()
    });

    return record;
  }

  async deleteClient(tenantId) {
    return await db.delete("dpdp_clients", c => c.tenant_id === tenantId);
  }
}

module.exports = new ClientService();
