/**
 * Privacy Notice Service (Form 13, Section 5)
 */

const db = require("../database/db");

class NoticeService {
  async getActiveNotice(tenantId = "ASCII_GROUP", lang = "en") {
    let notice = await db.get(
      "dpdp_notices",
      n => n.tenant_id === tenantId && n.is_active && n.language_code === lang
    );

    if (!notice && lang !== "en") {
      notice = await db.get(
        "dpdp_notices",
        n => n.tenant_id === tenantId && n.is_active && n.language_code === "en"
      );
    }

    if (!notice) return null;

    const purposes = await db.all("dpdp_purposes", p => p.tenant_id === tenantId);

    return {
      noticeId: notice.notice_id,
      version: notice.version_tag,
      language: notice.language_code,
      title: notice.notice_title,
      bodyMarkdown: notice.notice_body_markdown,
      dpoContact: {
        name: notice.dpo_name,
        email: notice.dpo_email,
        phone: notice.dpo_phone
      },
      purposes: purposes.map(p => ({
        purposeId: p.purpose_id,
        code: p.purpose_code,
        description: p.purpose_description,
        isMandatory: !!p.is_mandatory,
        lawfulBasis: p.lawful_basis,
        retentionMonths: p.retention_period_months
      }))
    };
  }

  async getAllNotices(tenantId = "ASCII_GROUP") {
    return await db.all("dpdp_notices", n => n.tenant_id === tenantId);
  }

  async getLanguages(tenantId = "ASCII_GROUP") {
    const notices = await db.all("dpdp_notices", n => n.tenant_id === tenantId && n.is_active);
    return [...new Set(notices.map(n => n.language_code))];
  }

  async createNotice(data) {
    const {
      tenantId = "ASCII_GROUP",
      noticeId,
      versionTag,
      languageCode,
      title,
      bodyMarkdown,
      dpoName,
      dpoEmail,
      dpoPhone
    } = data;

    return await db.insert("dpdp_notices", {
      tenant_id: tenantId,
      notice_id: noticeId,
      version_tag: versionTag,
      language_code: languageCode,
      notice_title: title,
      notice_body_markdown: bodyMarkdown,
      dpo_name: dpoName || "Data Protection Officer",
      dpo_email: dpoEmail || "dpo@company.com",
      dpo_phone: dpoPhone || "",
      is_active: true
    });
  }
}

module.exports = new NoticeService();
