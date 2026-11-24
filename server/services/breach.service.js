/**
 * Security Breach Response Service (Form 12, Section 8(6))
 */

const crypto = require("node:crypto");
const db = require("../database/db");

class BreachService {
  async reportIncident({
    tenantId = "ASCII_GROUP",
    incidentTitle,
    severityLevel,
    affectedCount = 0,
    remediationSteps = ""
  }) {
    const incidentId = "BRC-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const discoveredAt = new Date().toISOString();

    await db.insert("dpdp_breach_incidents", {
      incident_id: incidentId,
      tenant_id: tenantId,
      incident_title: incidentTitle,
      severity_level: severityLevel,
      affected_principals_count: Number(affectedCount) || 0,
      reported_to_dpbi: false,
      dpbi_reported_at: null,
      principals_notified: false,
      remediation_steps: remediationSteps || "",
      discovered_at: discoveredAt
    });

    return {
      incidentId,
      discoveredAt,
      dpbiReportingDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      dpbiReportingStatus: "PENDING"
    };
  }

  async getAllIncidents(tenantId = "ASCII_GROUP") {
    return await db.all("dpdp_breach_incidents", b => b.tenant_id === tenantId);
  }

  async notifyDpbi(incidentId) {
    const reportedAt = new Date().toISOString();
    const ackNumber = "DPBI-ACK-" + crypto.randomBytes(5).toString("hex").toUpperCase();

    const count = await db.update(
      "dpdp_breach_incidents",
      b => b.incident_id === incidentId,
      {
        reported_to_dpbi: true,
        dpbi_reported_at: reportedAt
      }
    );

    return {
      updated: count > 0,
      reportedAt,
      dpbiReceiptNumber: ackNumber
    };
  }
}

module.exports = new BreachService();
