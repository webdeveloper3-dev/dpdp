const express = require("express");
const dsrController = require("../controller/dsr.controller");

const router = express.Router();

router.post("/request", (req, res, next) => dsrController.submit(req, res, next));
router.get("/requests", (req, res, next) => dsrController.getAll(req, res, next));
router.get("/export/:principalId", (req, res, next) => dsrController.exportData(req, res, next));
router.post("/erasure", (req, res, next) => dsrController.erasure(req, res, next));

module.exports = router;
