const express = require("express");
const grievanceController = require("../controller/grievance.controller");

const router = express.Router();

router.post("/submit", (req, res, next) => grievanceController.submit(req, res, next));
router.get("/tickets", (req, res, next) => grievanceController.getAll(req, res, next));
router.patch("/tickets/:ticketId", (req, res, next) => grievanceController.update(req, res, next));

module.exports = router;
