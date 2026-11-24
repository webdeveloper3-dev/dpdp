/**
 * Central Main Router (router.js)
 */

const express = require("express");
const config = require("../config");

const clientRouter = require("./client.router");
const noticeRouter = require("./notice.router");
const consentRouter = require("./consent.router");
const dsrRouter = require("./dsr.router");
const grievanceRouter = require("./grievance.router");
const breachRouter = require("./breach.router");
const ropaRouter = require("./ropa.router");
const cryptoRouter = require("./crypto.router");

const router = express.Router();

// Health Check
router.get("/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "DPDP Compliance Engine & Microservice",
    version: "2.0.0",
    act: config.act,
    timestamp: new Date().toISOString()
  });
});

// DPDP Sub-Routers
router.use("/dpdp/clients", clientRouter);
router.use("/dpdp/notice", noticeRouter);
router.use("/dpdp/consent", consentRouter);
router.use("/dpdp/dsr", dsrRouter);
router.use("/dpdp/grievance", grievanceRouter);
router.use("/dpdp/breach", breachRouter);
router.use("/dpdp/ropa", ropaRouter);
router.use("/dpdp/crypto", cryptoRouter);

module.exports = router;
