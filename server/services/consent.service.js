/**
 * Consent Capture & Withdrawal Service (Form 13, Section 6)
 */

const crypto = require("node:crypto");
const db = require("../database/db");

class ConsentService {
  async recordConsent({
    tenantId = "ASCII_GROUP",
    principalId,
    noticeId,
    noticeVersion,
    items = [],
    isMinor = false,
    guardianPrincipalId = null,
    ipAddress = "127.0.0.1",
    userAgent = "Client Application"
  }) {
    const timestamp = new Date().toISOString();

    // 1. Generate SHA-256 Cryptographic Digital Receipt Signature
    const signaturePayload = `${principalId}|${noticeId}|${noticeVersion}|${timestamp}|${JSON.stringify(items)}|dpdp_salt_2026`;
    const signatureHash = crypto.createHash("sha256").update(signaturePayload).digest("hex");

    // 2. Insert Master Consent Record (Header)
    const consentRecord = await db.insert("dpdp_consent_records", {
      tenant_id: tenantId,
      principal_id: String(principalId),
      notice_id: noticeId,
      notice_version: noticeVersion,
      consent_status: "GIVEN",
      ip_address: ipAddress,
      user_agent: userAgent,
      consent_signature_hash: signatureHash,
      is_minor: Boolean(isMinor),
      guardian_principal_id: guardianPrincipalId,
      given_at: timestamp,
      withdrawn_at: null
    });

    // 3. Insert Granular Purpose-Wise Line Items
    const insertedItems = [];
    for (const item of items) {
      const lineItem = await db.insert("dpdp_consent_items", {
        consent_id: consentRecord.consent_id,
        purpose_id: item.purposeId,
        is_granted: Boolean(item.isGranted)
      });
      insertedItems.push(lineItem);
    }

    return {
      consentId: consentRecord.consent_id,
      principalId: consentRecord.principal_id,
      noticeVersion,
      status: "GIVEN",
      signatureHash: consentRecord.consent_signature_hash,
      timestamp,
      itemizedPurposesCount: insertedItems.length,
      items: insertedItems
    };
  }

  async withdrawConsent({ tenantId = "ASCII_GROUP", principalId, purposeId = null, reason = null }) {
    const consents = await db.all(
      "dpdp_consent_records",
      c => c.tenant_id === tenantId && c.principal_id === String(principalId) && c.consent_status === "GIVEN"
    );

    if (consents.length === 0) {
      return { found: false };
    }

    consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at));
    const latestConsent = consents[0];
    const timestamp = new Date().toISOString();

    if (purposeId) {
      await db.update(
        "dpdp_consent_items",
        item => item.consent_id === latestConsent.consent_id && item.purpose_id === purposeId,
        { is_granted: false }
      );
    } else {
      await db.update(
        "dpdp_consent_records",
        c => c.consent_id === latestConsent.consent_id,
        { consent_status: "WITHDRAWN", withdrawn_at: timestamp }
      );
      await db.update(
        "dpdp_consent_items",
        item => item.consent_id === latestConsent.consent_id,
        { is_granted: false }
      );
    }

    return {
      found: true,
      consentId: latestConsent.consent_id,
      principalId,
      purposeWithdrawn: purposeId || "ALL_PURPOSES",
      withdrawnAt: timestamp,
      status: purposeId ? "PARTIALLY_WITHDRAWN" : "WITHDRAWN"
    };
  }

  async getStatus(principalId, tenantId = "ASCII_GROUP") {
    const consents = await db.all(
      "dpdp_consent_records",
      c => c.tenant_id === tenantId && c.principal_id === String(principalId)
    );

    if (consents.length === 0) {
      return { hasConsent: false, activeConsents: [] };
    }

    consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at));
    const latest = consents[0];

    const items = await db.all("dpdp_consent_items", item => item.consent_id === latest.consent_id);
    const purposes = await db.all("dpdp_purposes", p => p.tenant_id === tenantId);

    const detailedItems = items.map(item => {
      const p = purposes.find(x => x.purpose_id === item.purpose_id);
      return {
        purposeId: item.purpose_id,
        purposeCode: p ? p.purpose_code : item.purpose_id,
        description: p ? p.purpose_description : "",
        isGranted: !!item.is_granted
      };
    });

    return {
      hasConsent: latest.consent_status === "GIVEN",
      record: {
        consentId: latest.consent_id,
        status: latest.consent_status,
        noticeVersion: latest.notice_version,
        givenAt: latest.given_at,
        withdrawnAt: latest.withdrawn_at,
        signature: latest.consent_signature_hash,
        items: detailedItems
      }
    };
  }

  async verifyConsent(signatureHash) {
    const record = await db.get("dpdp_consent_records", c => c.consent_signature_hash === signatureHash);
    if (!record) return null;

    const items = await db.all("dpdp_consent_items", ci => ci.consent_id === record.consent_id);
    return { record, items };
  }

  async getConsentHistory(principalId, tenantId = "ASCII_GROUP") {
    const records = await db.all(
      "dpdp_consent_records",
      c => c.tenant_id === tenantId && c.principal_id === String(principalId)
    );
    const result = [];
    for (const r of records) {
      const items = await db.all("dpdp_consent_items", ci => ci.consent_id === r.consent_id);
      result.push({ ...r, items });
    }
    return result;
  }
}

module.exports = new ConsentService();
