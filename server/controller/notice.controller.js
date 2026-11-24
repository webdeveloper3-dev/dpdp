/**
 * Privacy Notice Controller
 */

const noticeService = require("../services/notice.service");

class NoticeController {
  async getActive(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || req.headers["x-tenant-id"] || "ASCII_GROUP";
      const lang = req.query.lang || "en";

      const data = await noticeService.getActiveNotice(tenantId, lang);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "No active privacy notice configured for this tenant"
        });
      }

      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const notices = await noticeService.getAllNotices(tenantId);
      return res.json({ success: true, count: notices.length, notices });
    } catch (err) {
      next(err);
    }
  }

  async getLanguages(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const languages = await noticeService.getLanguages(tenantId);
      return res.json({ success: true, languages });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { noticeId, versionTag, languageCode, title, bodyMarkdown } = req.body;
      if (!noticeId || !versionTag || !languageCode || !title || !bodyMarkdown) {
        return res.status(400).json({ success: false, message: "Missing required notice parameters" });
      }

      const record = await noticeService.createNotice(req.body);
      return res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NoticeController();
