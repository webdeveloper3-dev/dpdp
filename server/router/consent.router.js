const express = require("express");
const consentController = require("../controller/consent.controller");

const router = express.Router();

router.post("/record", (req, res, next) => consentController.record(req, res, next));
router.post("/withdraw", (req, res, next) => consentController.withdraw(req, res, next));
router.get("/status/:principalId", (req, res, next) => consentController.getStatus(req, res, next));
router.get("/verify/:hash", (req, res, next) => consentController.verify(req, res, next));
router.get("/history/:principalId", (req, res, next) => consentController.history(req, res, next));

module.exports = router;
