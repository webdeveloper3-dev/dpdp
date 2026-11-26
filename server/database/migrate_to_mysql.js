const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const config = require("../config");

const DB_FILE = path.join(__dirname, "dpdp_data.json");

function formatVal(colName, val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "object" && !(val instanceof Date)) return JSON.stringify(val);
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
    // Convert ISO string to MySQL YYYY-MM-DD HH:MM:SS format
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 19).replace("T", " ");
    }
  }
  return val;
}

async function migrate() {
  const dbName = (config.db.database && config.db.database.trim()) || "dpdp";
  console.log(`Connecting to MySQL at ${config.db.host}:${config.db.port}...`);

  // 1. Ensure database exists
  const rootConn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password
  });
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await rootConn.end();

  // 2. Connect to database
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: dbName
  });

  // 3. Ensure tables exist using Sequelize sync
  const { sequelize } = require("../models");
  await sequelize.sync();

  // 4. Load JSON seed data and insert
  if (fs.existsSync(DB_FILE)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    const tables = data.tables || {};

    const tableOrder = [
      "dpdp_clients",
      "dpdp_departments",
      "dpdp_business_processes",
      "dpdp_applications",
      "dpdp_storage_locations",
      "dpdp_collection_points",
      "dpdp_principal_categories",
      "dpdp_data_catalog",
      "dpdp_purposes",
      "dpdp_notices",
      "dpdp_consent_records",
      "dpdp_consent_items",
      "dpdp_dsr_requests",
      "dpdp_grievance_tickets",
      "dpdp_retention_rules",
      "dpdp_disposal_log",
      "dpdp_breach_incidents",
      "dpdp_access_matrix",
      "dpdp_data_processors",
      "dpdp_third_party_data",
      "dpdp_security_safeguards"
    ];

    for (const tableName of tableOrder) {
      const rows = tables[tableName] || [];
      if (rows.length > 0) {
        // Fetch actual valid columns for this table from MySQL
        const [columnsResult] = await conn.query(`SHOW COLUMNS FROM \`${tableName}\`;`);
        const validCols = new Set(columnsResult.map(c => c.Field));

        for (const rawRow of rows) {
          const row = { ...rawRow };
          // Field aliases mapping for timestamp discrepancies
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

          // Filter only valid columns
          const keys = Object.keys(row).filter(k => validCols.has(k));
          const vals = keys.map(k => formatVal(k, row[k]));
          const placeholders = keys.map(() => "?").join(", ");
          const quotedKeys = keys.map(k => `\`${k}\``).join(", ");
          const updateAssignments = keys.map(k => `\`${k}\`=VALUES(\`${k}\`)`).join(", ");

          const sql = `INSERT INTO \`${tableName}\` (${quotedKeys}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateAssignments}`;
          try {
            await conn.execute(sql, vals);
          } catch (err) {
            console.error(`[MySQL Migrate] Error on table ${tableName}:`, err.message);
          }
        }
        console.log(`  ✅ Synced table: ${tableName} (${rows.length} rows)`);
      }
    }
  }

  const [clientCount] = await conn.query("SELECT COUNT(*) as count FROM dpdp_clients;");
  console.log(`\n🎉 MySQL Migration Complete! Active Clients in MySQL: ${clientCount[0].count}`);
  await conn.end();
}

if (require.main === module) {
  migrate().then(() => process.exit(0)).catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}

module.exports = migrate;
