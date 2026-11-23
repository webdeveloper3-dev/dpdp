/**
 * ====================================================================
 * DPDP MASTER DATABASE ADAPTER & STORAGE ENGINE
 * ====================================================================
 * Provides a unified async query interface (get, all, run, query)
 * for the 14 DPDP Compliance Tables.
 * Uses an embedded persistent JSON/File storage backed by schema.sql
 * ensuring zero setup dependencies on any operating system.
 */

const fs = require("node:fs");
const path = require("node:path");

const DB_FILE = path.join(__dirname, "dpdp_data.json");
const SCHEMA_FILE = path.join(__dirname, "schema.sql");

// Initial in-memory table structures matching schema.sql
let tables = {
  dpdp_clients: [],
  dpdp_departments: [],
  dpdp_business_processes: [],
  dpdp_applications: [],
  dpdp_storage_locations: [],
  dpdp_collection_points: [],
  dpdp_principal_categories: [],
  dpdp_data_catalog: [],
  dpdp_purposes: [],
  dpdp_notices: [],
  dpdp_consent_records: [],
  dpdp_consent_items: [],
  dpdp_dsr_requests: [],
  dpdp_grievance_tickets: [],
  dpdp_retention_rules: [],
  dpdp_disposal_log: [],
  dpdp_breach_incidents: [],
  dpdp_access_matrix: [],
  dpdp_data_processors: [],
  dpdp_third_party_data: [],
  dpdp_security_safeguards: []
};

let autoInc = {
  dpdp_consent_records: 1,
  dpdp_consent_items: 1,
  dpdp_disposal_log: 1
};

// Load saved data if exists
function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      tables = Object.assign(tables, data.tables || {});
      autoInc = Object.assign(autoInc, data.autoInc || {});
    }
  } catch (err) {
    console.error("[DPDP DB] Error reading database file, starting fresh:", err.message);
  }
}

// Persist tables to disk
function save() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tables, autoInc }, null, 2), "utf8");
  } catch (err) {
    console.error("[DPDP DB] Error persisting database file:", err.message);
  }
}

load();

const db = {
  /**
   * Get all rows from a table matching conditions
   */
  async all(tableName, filterFn = () => true) {
    const list = tables[tableName] || [];
    return list.filter(filterFn);
  },

  /**
   * Get single row matching filter
   */
  async get(tableName, filterFn) {
    const list = tables[tableName] || [];
    return list.find(filterFn) || null;
  },

  /**
   * Insert row into table
   */
  async insert(tableName, record) {
    if (!tables[tableName]) {
      tables[tableName] = [];
    }
    const item = { ...record };
    if (tableName === "dpdp_consent_records" && !item.consent_id) {
      item.consent_id = autoInc.dpdp_consent_records++;
    }
    if (tableName === "dpdp_consent_items" && !item.item_id) {
      item.item_id = autoInc.dpdp_consent_items++;
    }
    if (tableName === "dpdp_disposal_log" && !item.disposal_id) {
      item.disposal_id = autoInc.dpdp_disposal_log++;
    }
    if (!item.created_at) {
      item.created_at = new Date().toISOString();
    }
    tables[tableName].push(item);
    save();
    return item;
  },

  /**
   * Update rows matching filter
   */
  async update(tableName, filterFn, updates) {
    const list = tables[tableName] || [];
    let updatedCount = 0;
    for (let i = 0; i < list.length; i++) {
      if (filterFn(list[i])) {
        list[i] = { ...list[i], ...updates, updated_at: new Date().toISOString() };
        updatedCount++;
      }
    }
    if (updatedCount > 0) save();
    return updatedCount;
  },

  /**
   * Delete rows matching filter
   */
  async delete(tableName, filterFn) {
    const initial = (tables[tableName] || []).length;
    tables[tableName] = (tables[tableName] || []).filter(item => !filterFn(item));
    const deletedCount = initial - tables[tableName].length;
    if (deletedCount > 0) save();
    return deletedCount;
  },

  /**
   * Raw direct access to in-memory tables
   */
  getTables() {
    return tables;
  },

  /**
   * Reset / clear database
   */
  reset() {
    for (const key of Object.keys(tables)) {
      tables[key] = [];
    }
    autoInc = { dpdp_consent_records: 1, dpdp_consent_items: 1, dpdp_disposal_log: 1 };
    save();
  }
};

module.exports = db;
