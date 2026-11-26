/**
 * ====================================================================
 * DPDP MASTER DATABASE ADAPTER & STORAGE ENGINE (MySQL + JSON Dual Persistence)
 * ====================================================================
 * Provides a unified async query interface (get, all, insert, update, delete, rawQuery)
 * for the 21 DPDP Compliance Tables.
 *
 * Persistence Strategy:
 * 1. Primary: Direct MySQL Engine connection pool (Sequelize / mysql2)
 *    when DB_DIALECT=mysql (localhost:3306).
 * 2. Secondary & Fallback: Persistent embedded JSON cache (dpdp_data.json)
 *    ensuring resilience, fast zero-latency reads, and standalone testing.
 */

const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const config = require("../config");
const logger = require("../utils/logger");

const DB_FILE = path.join(__dirname, "dpdp_data.json");

// Primary keys mapping for the 21 DPDP compliance tables
const TABLE_PKS = {
  dpdp_clients: ["tenant_id"],
  dpdp_entities: ["tenant_id", "entity_id"],
  dpdp_companies: ["tenant_id", "company_id"],
  dpdp_departments: ["tenant_id", "department_id"],
  dpdp_functions: ["tenant_id", "function_id"],
  dpdp_business_processes: ["tenant_id", "process_id"],
  dpdp_applications: ["tenant_id", "app_id"],
  dpdp_storage_locations: ["tenant_id", "storage_id"],
  dpdp_collection_points: ["tenant_id", "point_id"],
  dpdp_principal_categories: ["tenant_id", "category_id"],
  dpdp_data_catalog: ["tenant_id", "item_id"],
  dpdp_purposes: ["tenant_id", "purpose_id"],
  dpdp_notices: ["tenant_id", "notice_id", "version_tag", "language_code"],
  dpdp_consent_records: ["consent_id"],
  dpdp_consent_items: ["item_id"],
  dpdp_dsr_requests: ["request_id"],
  dpdp_grievance_tickets: ["ticket_id"],
  dpdp_retention_rules: ["tenant_id", "rule_id"],
  dpdp_disposal_log: ["disposal_id"],
  dpdp_breach_incidents: ["incident_id"],
  dpdp_access_matrix: ["tenant_id", "matrix_id"],
  dpdp_data_processors: ["tenant_id", "processor_id"],
  dpdp_third_party_data: ["tenant_id", "third_party_id"],
  dpdp_security_safeguards: ["tenant_id", "safeguard_id"]
};

// Initial in-memory table structures matching schema.sql
let tables = {
  dpdp_clients: [],
  dpdp_entities: [],
  dpdp_companies: [],
  dpdp_departments: [],
  dpdp_functions: [],
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

// Cached table valid columns from MySQL
let tableColumnsCache = {};

// MySQL Pool Instance
let pool = null;
let isMySQLReady = false;
let initPromise = null;

// 1. Initial file load (immediate synchronous start)
function loadFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      tables = Object.assign(tables, data.tables || {});
      autoInc = Object.assign(autoInc, data.autoInc || {});
    }
  } catch (err) {
    logger.warn("[DPDP DB] Error reading JSON file, starting fresh:", err.message);
  }
}

// 2. Persist tables to JSON file
function saveToFile() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tables, autoInc }, null, 2), "utf8");
  } catch (err) {
    logger.error("[DPDP DB] Error persisting database file:", err.message);
  }
}

loadFromFile();

// Value formatter for MySQL queries
function formatMySQLVal(colName, val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "object" && !(val instanceof Date)) {
    return JSON.stringify(val);
  }
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 19).replace("T", " ");
    }
  }
  return val;
}

// Format incoming record for MySQL table columns
function prepareRecordForMySQL(tableName, rawRow) {
  const validCols = tableColumnsCache[tableName];
  const row = { ...rawRow };

  if (validCols) {
    // Timestamp aliases
    if (!validCols.has("created_at") && validCols.has("given_at") && row.created_at) {
      row.given_at = row.created_at;
      delete row.created_at;
    }
    if (!validCols.has("created_at") && validCols.has("submitted_at") && row.created_at) {
      row.submitted_at = row.created_at;
      delete row.created_at;
    }
    if (!validCols.has("updated_at") && row.updated_at) {
      delete row.updated_at;
    }
    if (validCols.has("updated_at") && !row.updated_at) {
      row.updated_at = row.created_at || new Date().toISOString();
    }
    if (validCols.has("created_at") && !row.created_at) {
      row.created_at = new Date().toISOString();
    }

    const filtered = {};
    for (const k of Object.keys(row)) {
      if (validCols.has(k)) {
        filtered[k] = formatMySQLVal(k, row[k]);
      }
    }
    return filtered;
  }

  // Fallback if columns not cached yet
  const cleaned = {};
  for (const k of Object.keys(row)) {
    cleaned[k] = formatMySQLVal(k, row[k]);
  }
  return cleaned;
}

// Initialize MySQL Pool and sync data
async function initMySQL() {
  if (initPromise) return initPromise;
  if (config.db.dialect !== "mysql") return false;

  initPromise = (async () => {
    const dbName = (config.db.database && config.db.database.trim()) || "dpdp";

    try {
      // First, ensure DB exists
      const rootConn = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.username,
        password: config.db.password
      });
      await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await rootConn.end();

      pool = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.username,
        password: config.db.password,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test connection
      const conn = await pool.getConnection();

      // Cache valid column schemas
      for (const tableName of Object.keys(tables)) {
        try {
          const [cols] = await conn.query(`SHOW COLUMNS FROM \`${tableName}\`;`);
          tableColumnsCache[tableName] = new Set(cols.map(c => c.Field));
        } catch (e) {
          // Table might not exist yet if before sync
        }
      }

      // Load data from MySQL into memory
      let totalLoaded = 0;
      for (const tableName of Object.keys(tables)) {
        if (!pool) break;
        if (tableColumnsCache[tableName]) {
          try {
            const [rows] = await conn.query(`SELECT * FROM \`${tableName}\`;`);
            if (rows && rows.length > 0) {
              tables[tableName] = rows.map(r => {
                const obj = { ...r };
                // Normalize JSON columns if stringified
                if (obj.purposes && typeof obj.purposes === "string") {
                  try { obj.purposes = JSON.parse(obj.purposes); } catch (_) {}
                }
                if (obj.safeguard_details && typeof obj.safeguard_details === "string") {
                  try { obj.safeguard_details = JSON.parse(obj.safeguard_details); } catch (_) {}
                }
                return obj;
              });
              totalLoaded += rows.length;
            }
          } catch (err) {
            if (pool) {
              logger.warn(`[DPDP DB] Error reading ${tableName} from MySQL:`, err.message);
            }
          }
        }
      }

      conn.release();
      isMySQLReady = true;
      logger.info(`[DPDP DB] Connected to MySQL (${dbName}) on ${config.db.host}:${config.db.port} [${totalLoaded} rows loaded]`);
      return true;
    } catch (err) {
      logger.warn(`[DPDP DB] MySQL connection unavailable (${err.message}). Using JSON store fallback.`);
      isMySQLReady = false;
      return false;
    }
  })();

  return initPromise;
}

// Auto-trigger MySQL initialization
initMySQL().catch(err => {
  logger.warn("[DPDP DB] Deferred MySQL initialization notice:", err.message);
});

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
   * Insert row into table (writes to MySQL and local cache)
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

    // Write-through to MySQL
    if (isMySQLReady && pool) {
      try {
        const myRow = prepareRecordForMySQL(tableName, item);
        const keys = Object.keys(myRow);
        if (keys.length > 0) {
          const quotedKeys = keys.map(k => `\`${k}\``).join(", ");
          const placeholders = keys.map(() => "?").join(", ");
          const updateAssignments = keys.map(k => `\`${k}\`=VALUES(\`${k}\`)`).join(", ");
          const vals = keys.map(k => myRow[k]);

          const sql = `INSERT INTO \`${tableName}\` (${quotedKeys}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateAssignments}`;
          const [result] = await pool.execute(sql, vals);
          if (result && result.insertId) {
            if (tableName === "dpdp_consent_records") item.consent_id = result.insertId;
            if (tableName === "dpdp_consent_items") item.item_id = result.insertId;
            if (tableName === "dpdp_disposal_log") item.disposal_id = result.insertId;
          }
        }
      } catch (err) {
        logger.error(`[DPDP DB] MySQL insert error on ${tableName}:`, err.message);
      }
    }

    // Upsert in-memory cache (matching MySQL ON DUPLICATE KEY UPDATE)
    const pks = TABLE_PKS[tableName] || [];
    const existingIdx = pks.length > 0 && pks.every(k => item[k] !== undefined)
      ? tables[tableName].findIndex(row => pks.every(k => row[k] === item[k]))
      : -1;

    if (existingIdx >= 0) {
      tables[tableName][existingIdx] = { ...tables[tableName][existingIdx], ...item };
    } else {
      tables[tableName].push(item);
    }
    saveToFile();
    return item;
  },

  /**
   * Update rows matching filter (writes to MySQL and local cache)
   */
  async update(tableName, filterFn, updates) {
    const list = tables[tableName] || [];
    let updatedCount = 0;
    const nowIso = new Date().toISOString();

    for (let i = 0; i < list.length; i++) {
      if (filterFn(list[i])) {
        const oldItem = list[i];
        const updatedItem = { ...oldItem, ...updates, updated_at: nowIso };

        if (isMySQLReady && pool) {
          try {
            const pks = TABLE_PKS[tableName] || [];
            const pkConditions = pks.filter(k => oldItem[k] !== undefined);
            if (pkConditions.length > 0) {
              const preparedUpdates = prepareRecordForMySQL(tableName, { ...updates, updated_at: nowIso });
              const updateKeys = Object.keys(preparedUpdates);

              if (updateKeys.length > 0) {
                const setClause = updateKeys.map(k => `\`${k}\` = ?`).join(", ");
                const whereClause = pkConditions.map(k => `\`${k}\` = ?`).join(" AND ");
                const params = [
                  ...updateKeys.map(k => preparedUpdates[k]),
                  ...pkConditions.map(k => oldItem[k])
                ];
                await pool.execute(`UPDATE \`${tableName}\` SET ${setClause} WHERE ${whereClause}`, params);
              }
            }
          } catch (err) {
            logger.error(`[DPDP DB] MySQL update error on ${tableName}:`, err.message);
          }
        }

        list[i] = updatedItem;
        updatedCount++;
      }
    }

    if (updatedCount > 0) saveToFile();
    return updatedCount;
  },

  /**
   * Delete rows matching filter (writes to MySQL and local cache)
   */
  async delete(tableName, filterFn) {
    const list = tables[tableName] || [];
    const toDelete = list.filter(item => filterFn(item));

    if (toDelete.length > 0 && isMySQLReady && pool) {
      const pks = TABLE_PKS[tableName] || [];
      for (const item of toDelete) {
        try {
          const pkConditions = pks.filter(k => item[k] !== undefined);
          if (pkConditions.length > 0) {
            const whereClause = pkConditions.map(k => `\`${k}\` = ?`).join(" AND ");
            const params = pkConditions.map(k => item[k]);
            await pool.execute(`DELETE FROM \`${tableName}\` WHERE ${whereClause}`, params);
          }
        } catch (err) {
          logger.error(`[DPDP DB] MySQL delete error on ${tableName}:`, err.message);
        }
      }
    }

    const initial = list.length;
    tables[tableName] = list.filter(item => !filterFn(item));
    const deletedCount = initial - tables[tableName].length;
    if (deletedCount > 0) saveToFile();
    return deletedCount;
  },

  /**
   * Execute raw SQL query directly on MySQL connection pool
   */
  async rawQuery(sql, params = []) {
    if (!isMySQLReady || !pool) {
      throw new Error("MySQL connection is not initialized.");
    }
    const [rows, fields] = await pool.execute(sql, params);
    return { rows, fields };
  },

  /**
   * Explicitly sync all records from MySQL into memory cache
   */
  async syncFromMySQL() {
    return await initMySQL();
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
  async reset() {
    for (const key of Object.keys(tables)) {
      tables[key] = [];
    }
    autoInc = { dpdp_consent_records: 1, dpdp_consent_items: 1, dpdp_disposal_log: 1 };
    saveToFile();
  },

  /**
   * Graceful close of MySQL pool connection
   */
  async close() {
    if (initPromise) {
      try { await initPromise; } catch (_) {}
    }
    if (pool) {
      try {
        await pool.end();
      } catch (_) {}
      pool = null;
      isMySQLReady = false;
      initPromise = null;
    }
  }
};

module.exports = db;
