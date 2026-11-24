const express = require("express");
const breachController = require("../controller/breach.controller");

const router = express.Router();

router.post("/report", (req, res, next) => breachController.report(req, res, next));
router.get("/incidents", (req, res, next) => breachController.getAll(req, res, next));
router.post("/notify-dpbi/:incidentId", (req, res, next) => breachController.notify(req, res, next));

module.exports = router;
