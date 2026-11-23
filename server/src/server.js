/**
 * ====================================================================
 * DPDP ENGINE MICROSERVICE SERVER ENTRYPOINT
 * ====================================================================
 */

const app = require("./app");
const seed = require("../database/seed");
const db = require("../database/db");

const PORT = process.env.PORT || 5000;

async function start() {
  // Check if DB needs initial seeding
  const depts = await db.all("dpdp_departments");
  if (depts.length === 0) {
    console.log("[DPDP Server] Empty database detected. Running initial RoPA seed...");
    await seed();
  }

  app.listen(PORT, () => {
    console.log("=================================================================");
    console.log(`🏛️  GENERALIZED DPDP ENGINE & MICROSERVICE RUNNING ON PORT ${PORT}`);
    console.log("=================================================================");
    console.log(`• Healthcheck : http://localhost:${PORT}/api/health`);
    console.log(`• Active Notice: http://localhost:${PORT}/api/dpdp/notice/active?lang=hi`);
    console.log(`• RoPA Overview: http://localhost:${PORT}/api/dpdp/ropa/overview`);
    console.log("• Standards    : India Digital Personal Data Protection Act 2023");
    console.log("=================================================================");
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
