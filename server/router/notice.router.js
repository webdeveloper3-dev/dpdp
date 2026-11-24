const express = require("express");
const noticeController = require("../controller/notice.controller");

const router = express.Router();

router.get("/active", (req, res, next) => noticeController.getActive(req, res, next));
router.get("/all", (req, res, next) => noticeController.getAll(req, res, next));
router.get("/languages", (req, res, next) => noticeController.getLanguages(req, res, next));
router.post("/", (req, res, next) => noticeController.create(req, res, next));

module.exports = router;
