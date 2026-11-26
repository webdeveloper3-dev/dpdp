/**
 * Statutory RoPA (Record of Processing Activities) Service (Forms 01 to 12)
 */

const db = require("../database/db");

const FORMS_CONFIG = [
  { path: "entity", table: "dpdp_entities", idField: "entity_id" },
  { path: "company", table: "dpdp_companies", idField: "company_id" },
  { path: "department", table: "dpdp_departments", idField: "department_id" },
  { path: "function", table: "dpdp_functions", idField: "function_id" },
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

class RopaService {
  get formsConfig() {
    return FORMS_CONFIG;
  }

  async getOverview(tenantId = "ASCII_GROUP") {
    const [
      entities,
      companies,
      departments,
      functions,
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
      db.all("dpdp_entities", e => e.tenant_id === tenantId),
      db.all("dpdp_companies", co => co.tenant_id === tenantId),
      db.all("dpdp_departments", d => d.tenant_id === tenantId),
      db.all("dpdp_functions", fn => fn.tenant_id === tenantId),
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

    let score = 50;
    if (departments.length > 0) score += 5;
    if (processes.length > 0) score += 5;
    if (catalog.length > 0) score += 10;
    if (applications.length > 0) score += 5;
    if (locations.length > 0) score += 5;
    if (purposes.length > 0) score += 10;
    if (notices.length > 0) score += 10;

    return {
      tenantId,
      complianceScore: Math.min(100, score),
      counts: {
        form01_entities: entities.length,
        form01_companies: companies.length,
        form01_departments: departments.length,
        form01_functions: functions.length,
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
        form01: { entities, companies, departments, functions, processes },
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
    };
  }

  async getFormItems(formPath, tenantId = "ASCII_GROUP", filters = {}) {
    const config = FORMS_CONFIG.find(f => f.path === formPath);
    if (!config) throw new Error(`Unknown RoPA form: ${formPath}`);
    return await db.all(config.table, item => {
      if (item.tenant_id !== tenantId) return false;
      if (filters.entityId && item.entity_id !== filters.entityId) return false;
      if (filters.companyId && item.company_id !== filters.companyId) return false;
      return true;
    });
  }

  async addFormItem(formPath, data) {
    const config = FORMS_CONFIG.find(f => f.path === formPath);
    if (!config) throw new Error(`Unknown RoPA form: ${formPath}`);
    const tenantId = data.tenant_id || "ASCII_GROUP";
    const record = { ...data, tenant_id: tenantId, created_at: new Date().toISOString() };
    return await db.insert(config.table, record);
  }

  async deleteFormItem(formPath, id, tenantId = null) {
    const config = FORMS_CONFIG.find(f => f.path === formPath);
    if (!config) throw new Error(`Unknown RoPA form: ${formPath}`);
    return await db.delete(
      config.table,
      item => item[config.idField] === id && (!tenantId || item.tenant_id === tenantId)
    );
  }
}

module.exports = new RopaService();
