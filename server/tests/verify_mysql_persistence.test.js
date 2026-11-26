const assert = require("node:assert");
const db = require("../database/db");
const mysql = require("mysql2/promise");
const config = require("../config");

async function verifyPersistence() {
  console.log("🧪 Testing Direct MySQL Persistence Write-Through...");

  // 1. Wait for MySQL sync
  await db.syncFromMySQL();

  const testAppId = "APP-MYSQL-PERSIST-" + Date.now();
  const testRecord = {
    tenant_id: "ASCII_GROUP",
    app_id: testAppId,
    app_name: "MySQL Write-Through Test App",
    app_type: "Microservice",
    hosting_environment: "AWS Mumbai",
    data_residency_country: "India"
  };

  // 2. Insert via db.insert
  await db.insert("dpdp_applications", testRecord);

  // 3. Query directly with raw MySQL connection bypassing db.js
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: (config.db.database && config.db.database.trim()) || "dpdp"
  });

  const [rows] = await conn.query("SELECT * FROM dpdp_applications WHERE app_id = ?", [testAppId]);
  assert.strictEqual(rows.length, 1, "Record must exist directly in MySQL table dpdp_applications");
  assert.strictEqual(rows[0].app_name, "MySQL Write-Through Test App");
  console.log("  ✅ Direct MySQL Table INSERT Verified via independent raw connection!");

  // 4. Update via db.update
  await db.update(
    "dpdp_applications",
    a => a.app_id === testAppId,
    { app_name: "MySQL Updated App Name" }
  );

  const [updatedRows] = await conn.query("SELECT * FROM dpdp_applications WHERE app_id = ?", [testAppId]);
  assert.strictEqual(updatedRows.length, 1);
  assert.strictEqual(updatedRows[0].app_name, "MySQL Updated App Name");
  console.log("  ✅ Direct MySQL Table UPDATE Verified via independent raw connection!");

  // 5. Delete via db.delete
  await db.delete("dpdp_applications", a => a.app_id === testAppId);

  const [deletedRows] = await conn.query("SELECT * FROM dpdp_applications WHERE app_id = ?", [testAppId]);
  assert.strictEqual(deletedRows.length, 0, "Record must be deleted from MySQL table");
  console.log("  ✅ Direct MySQL Table DELETE Verified via independent raw connection!");

  await conn.end();
  await db.close();

  console.log("\n🎉 ALL DIRECT MYSQL PERSISTENCE TESTS PASSED (100% SUCCESS)!");
}

verifyPersistence().then(() => process.exit(0)).catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
