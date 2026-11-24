/**
 * MySQL Sequelize Schema Synchronization Script
 * Run: node database/sync.js [--force|--alter]
 */

const { sequelize } = require("../models");
const logger = require("../utils/logger");

async function syncDatabase() {
  const force = process.argv.includes("--force");
  const alter = process.argv.includes("--alter");

  console.log("=================================================================");
  console.log("🗄️  MYSQL SEQUELIZE SCHEMA SYNCHRONIZATION");
  console.log("=================================================================");
  console.log(`• Mode: ${force ? "FORCE (DROP & RECREATE)" : alter ? "ALTER" : "SAFE (CREATE IF NOT EXISTS)"}`);

  try {
    await sequelize.authenticate();
    logger.info("Connected to MySQL database successfully.");

    await sequelize.sync({ force, alter });
    logger.info("All 21 DPDP MySQL compliance tables synchronized successfully!");
    console.log("=================================================================");
    process.exit(0);
  } catch (err) {
    logger.error("MySQL Connection or Synchronization Error:", err.message);
    console.log("Please check your DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env");
    console.log("=================================================================");
    process.exit(1);
  }
}

if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase;
