/**
 * RoPA (13 Statutory Forms) Controller
 */

const ropaService = require("../services/ropa.service");

class RopaController {
  async getOverview(req, res, next) {
    try {
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const overview = await ropaService.getOverview(tenantId);
      return res.json({ success: true, ...overview });
    } catch (err) {
      next(err);
    }
  }

  async getFormItems(req, res, next) {
    try {
      const { formPath } = req.params;
      const tenantId = req.query.tenant_id || "ASCII_GROUP";
      const entityId = req.query.entity_id || null;
      const companyId = req.query.company_id || null;
      const items = await ropaService.getFormItems(formPath, tenantId, { entityId, companyId });
      return res.json({ success: true, count: items.length, items });
    } catch (err) {
      next(err);
    }
  }

  async createFormItem(req, res, next) {
    try {
      const { formPath } = req.params;
      const saved = await ropaService.addFormItem(formPath, req.body);
      return res.status(201).json({ success: true, data: saved });
    } catch (err) {
      next(err);
    }
  }

  async deleteFormItem(req, res, next) {
    try {
      const { formPath, id } = req.params;
      const tenantId = req.query.tenant_id || null;
      const count = await ropaService.deleteFormItem(formPath, id, tenantId);
      return res.json({ success: true, count, message: `Deleted ${id}` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RopaController();
