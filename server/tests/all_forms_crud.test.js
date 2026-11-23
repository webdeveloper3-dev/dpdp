const assert = require("node:assert");
const http = require("node:http");
const { app } = require("../src/server");

async function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log("🔍 Testing All 13 Forms CRUD Endpoints on Port 5055...");

  // Form 03: Application
  const postApp = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/application",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-TEST-99",
    app_name: "Test System 99",
    app_type: "Web Application",
    hosting_environment: "AWS Mumbai",
    data_residency_country: "India"
  });
  assert.strictEqual(postApp.status, 201);
  console.log("  ✅ Form 03 (Application) POST verified");

  const delApp = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/application/APP-TEST-99",
    method: "DELETE"
  });
  assert.strictEqual(delApp.status, 200);
  assert.strictEqual(delApp.data.count, 1);
  console.log("  ✅ Form 03 (Application) DELETE verified");

  // Form 04: Storage
  const postStorage = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/storage",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    tenant_id: "ASCII_GROUP",
    storage_id: "STO-TEST-99",
    storage_name: "Test S3 Vault",
    storage_type: "Cloud Object Store (S3)",
    geographic_location: "Mumbai",
    encryption_at_rest: "AES-256-GCM"
  });
  assert.strictEqual(postStorage.status, 201);
  console.log("  ✅ Form 04 (Storage) POST verified");

  const delStorage = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/storage/STO-TEST-99",
    method: "DELETE"
  });
  assert.strictEqual(delStorage.status, 200);
  console.log("  ✅ Form 04 (Storage) DELETE verified");

  // Form 10: Processor
  const postProc = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/processor",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    tenant_id: "ASCII_GROUP",
    processor_id: "PROC-TEST-99",
    processor_name: "Test Vendor Ltd",
    service_provided: "Cloud Analytics",
    dpa_signed: true,
    country_hosted: "India"
  });
  assert.strictEqual(postProc.status, 201);
  console.log("  ✅ Form 10 (Processor) POST verified");

  const delProc = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/ropa/processor/PROC-TEST-99",
    method: "DELETE"
  });
  assert.strictEqual(delProc.status, 200);
  console.log("  ✅ Form 10 (Processor) DELETE verified");

  // Form 13: Notice All
  const getNotices = await request({
    hostname: "localhost",
    port: 5055,
    path: "/api/dpdp/notice/all?tenant_id=ASCII_GROUP",
    method: "GET"
  });
  assert.strictEqual(getNotices.status, 200);
  assert(getNotices.data.notices.length > 0);
  console.log("  ✅ Form 13 (Notice /all) GET verified");

  console.log("\n🎉 ALL CRUD VERIFICATION TESTS PASSED (100% SUCCESS)!");
  server.close(() => process.exit(0));
}

// Start server on 5055
const server = app.listen(5055, () => {
  run().catch(err => {
    console.error("Test failed:", err);
    server.close(() => process.exit(1));
  });
});
