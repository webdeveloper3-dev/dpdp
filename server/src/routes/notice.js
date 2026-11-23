/**
 * ====================================================================
 * NOTICE API (FORM 13, SECTION 5)
 * ====================================================================
 * Multilingual dynamic privacy notices supporting English + 22 Indian Languages.
 */

const { express } = require("../lib/express");
const router = express.Router();
const db = require("../../database/db");

// GET /api/dpdp/notice/active?lang=hi&tenant_id=ASCII_GROUP
router.get("/active", async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || req.headers["x-tenant-id"] || "ASCII_GROUP";
    const lang = req.query.lang || "en";

    // 1. Fetch notice in requested language, fallback to 'en'
    let notice = await db.get("dpdp_notices", n => 
      n.tenant_id === tenantId && n.is_active && n.language_code === lang
    );

    if (!notice && lang !== "en") {
      notice = await db.get("dpdp_notices", n => 
        n.tenant_id === tenantId && n.is_active && n.language_code === "en"
      );
    }

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "No active privacy notice configured for this tenant"
      });
    }

    // 2. Fetch purpose checkboxes associated with this notice
    const purposes = await db.all("dpdp_purposes", p => p.tenant_id === tenantId);

    // 3. Return notice with purpose checkboxes
    return res.json({
      success: true,
      data: {
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
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/notice/all?tenant_id=ASCII_GROUP
router.get("/all", async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || "ASCII_GROUP";
    const notices = await db.all("dpdp_notices", n => n.tenant_id === tenantId);
    return res.json({ success: true, count: notices.length, notices });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dpdp/notice/languages
router.get("/languages", async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || "ASCII_GROUP";
    const notices = await db.all("dpdp_notices", n => n.tenant_id === tenantId && n.is_active);
    const languages = [...new Set(notices.map(n => n.language_code))];
    return res.json({ success: true, languages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dpdp/notice (Create/Update Notice by DPO)
router.post("/", async (req, res) => {
  try {
    const { tenantId = "ASCII_GROUP", noticeId, versionTag, languageCode, title, bodyMarkdown, dpoName, dpoEmail, dpoPhone } = req.body;
    
    if (!noticeId || !versionTag || !languageCode || !title || !bodyMarkdown) {
      return res.status(400).json({ success: false, message: "Missing required notice parameters" });
    }

    const record = await db.insert("dpdp_notices", {
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

    return res.status(201).json({ success: true, data: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
