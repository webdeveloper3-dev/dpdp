/**
 * ====================================================================
 * COMPREHENSIVE RoPA METADATA API (FORMS 01 TO 12)
 * ====================================================================
 * Full CRUD and querying for all 13 Statutory RoPA Audit Forms
 * parameterized per tenant_id.
 */

const { express } = require("../lib/express");
const router = express.Router();
const db = require("../../database/db");

// GET /api/dpdp/ropa/overview?tenant_id=XYZ - Complete 13-Form RoPA snapshot
router.get("/overview", async (req, res) => {
  try {
    const tenantId = req.query.tenant_id || "ASCII_GROUP";

    const [
      departments,
      processes,
      catalog,
      applications,
      locations,
      collectionPoints,
      principalCategories,
      purposes,
      retentionRules,
      accessMatrix,
      processors,
      thirdPartyData,
      securitySafeguards,
      notices
    ] = await Promise.all([
      db.all("dpdp_departments", d => d.tenant_id === tenantId),
      db.all("dpdp_business_processes", p => p.tenant_id === tenantId),
      db.all("dpdp_data_catalog", c => c.tenant_id === tenantId),
      db.all("dpdp_applications", a => a.tenant_id === tenantId),
      db.all("dpdp_storage_locations", s => s.tenant_id === tenantId),
      db.all("dpdp_collection_points", cp => cp.tenant_id === tenantId),
      db.all("dpdp_principal_categories", pc => pc.tenant_id === tenantId),
      db.all("dpdp_purposes", pu => pu.tenant_id === tenantId),
      db.all("dpdp_retention_rules", r => r.tenant_id === tenantId),
      db.all("dpdp_access_matrix", am => am.tenant_id === tenantId),
      db.all("dpdp_data_processors", dp => dp.tenant_id === tenantId),
      db.all("dpdp_third_party_data", tp => tp.tenant_id === tenantId),
      db.all("dpdp_security_safeguards", ss => ss.tenant_id === tenantId),
      db.all("dpdp_notices", n => n.tenant_id === tenantId)
    ]);

    // Calculate compliance health score
    let score = 50;
    if (departments.length > 0) score += 5;
    if (processes.length > 0) score += 5;
    if (catalog.length > 0) score += 10;
    if (applications.length > 0) score += 5;
    if (locations.length > 0) score += 5;
    if (purposes.length > 0) score += 10;
    if (notices.length > 0) score += 10;

    return res.json({
      success: true,
      tenantId,
      complianceScore: Math.min(100, score),
      counts: {
        form01_departments: departments.length,
        form01_processes: processes.length,
        form02_catalog: catalog.length,
        form03_applications: applications.length,
        form04_storageLocations: locations.length,
        form05_collectionPoints: collectionPoints.length,
        form06_principalCategories: principalCategories.length,
        form07_purposes: purposes.length,
        form08_retentionRules: retentionRules.length,
        form09_accessMatrix: accessMatrix.length,
        form10_processors: processors.length,
        form11_thirdParty: thirdPartyData.length,
        form12_security: securitySafeguards.length,
        form13_notices: notices.length
      },
      forms: {
        form01: { departments, processes },
        form02: catalog,
        form03: applications,
        form04: locations,
        form05: collectionPoints,
        form06: principalCategories,
        form07: purposes,
        form08: retentionRules,
        form09: accessMatrix,
        form10: processors,
        form11: thirdPartyData,
        form12: securitySafeguards,
        form13: notices
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Generic Handler Factory for RoPA Forms
const formsConfig = [
  { path: "department", table: "dpdp_departments", idField: "department_id" },
  { path: "process", table: "dpdp_business_processes", idField: "process_id" },
  { path: "catalog", table: "dpdp_data_catalog", idField: "item_id" },
  { path: "application", table: "dpdp_applications", idField: "app_id" },
  { path: "storage", table: "dpdp_storage_locations", idField: "storage_id" },
  { path: "collection-point", table: "dpdp_collection_points", idField: "point_id" },
  { path: "principal-category", table: "dpdp_principal_categories", idField: "category_id" },
  { path: "purpose", table: "dpdp_purposes", idField: "purpose_id" },
  { path: "retention-rule", table: "dpdp_retention_rules", idField: "rule_id" },
  { path: "access-matrix", table: "dpdp_access_matrix", idField: "matrix_id" },
  { path: "processor", table: "dpdp_data_processors", idField: "processor_id" },
  { path: "third-party", table: "dpdp_third_party_data", idField: "third_party_id" },
  { path: "security-safeguard", table: "dpdp_security_safeguards", idField: "safeguard_id" }
];

formsConfig.forEach(({ path, table, idField }) => {
  // GET items for tenant
  router.get(`/${path}`, async (req, res) => {
    const tenantId = req.query.tenant_id || "ASCII_GROUP";
    const items = await db.all(table, item => item.tenant_id === tenantId);
    res.json({ success: true, count: items.length, items });
  });

  // POST new item
  router.post(`/${path}`, async (req, res) => {
    try {
      const tenantId = req.body.tenant_id || "ASCII_GROUP";
      const record = { ...req.body, tenant_id: tenantId, created_at: new Date().toISOString() };
      const saved = await db.insert(table, record);
      res.status(201).json({ success: true, data: saved });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // DELETE item
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      const count = await db.delete(table, item => item[idField] === id);
      res.json({ success: true, count, message: `Deleted ${id}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

module.exports = router;
