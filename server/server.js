/**
 * Generalized DPDP Compliance Microservice & Engine
 * Digital Personal Data Protection Act 2023 (Republic of India)
 */

const express = require("express");
const cors = require("cors");
const config = require("./config");
const mainRouter = require("./router/router");
const { dpdpAuditLogger } = require("./middleware/auditLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const seed = require("./database/seed");
const db = require("./database/db");
const logger = require("./utils/logger");

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dpdpAuditLogger());

// Mount Central Main Router under /api
app.use("/api", mainRouter);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

let serverInstance = null;

async function start(port = config.port) {
  try {
    // Synchronize with MySQL if configured
    await db.syncFromMySQL();

    // Initial Database Seed check
    const depts = await db.all("dpdp_departments");
    if (depts.length === 0) {
      logger.info("[DPDP Server] Empty database detected. Running initial RoPA seed...");
      await seed();
    }

    serverInstance = app.listen(port, config.host, () => {
      console.log("=================================================================");
      console.log(`🏛️  DPDP COMPLIANCE ENGINE RUNNING ON PORT ${port}`);
      console.log("=================================================================");
      console.log(`• Healthcheck : http://localhost:${port}/api/health`);
      console.log(`• Active Notice: http://localhost:${port}/api/dpdp/notice/active?lang=hi`);
      console.log(`• RoPA Overview: http://localhost:${port}/api/dpdp/ropa/overview`);
      console.log(`• Standards    : ${config.act}`);
      console.log("=================================================================");
    });

    return serverInstance;
  } catch (err) {
    logger.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
