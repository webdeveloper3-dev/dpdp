const express = require("express");
const clientController = require("../controller/client.controller");

const router = express.Router();

router.get("/", (req, res, next) => clientController.getAll(req, res, next));
router.get("/:tenantId", (req, res, next) => clientController.getById(req, res, next));
router.post("/", (req, res, next) => clientController.create(req, res, next));
router.delete("/:tenantId", (req, res, next) => clientController.remove(req, res, next));

module.exports = router;
