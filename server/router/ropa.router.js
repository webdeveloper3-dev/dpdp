const express = require("express");
const ropaController = require("../controller/ropa.controller");
const ropaService = require("../services/ropa.service");

const router = express.Router();

router.get("/overview", (req, res, next) => ropaController.getOverview(req, res, next));

ropaService.formsConfig.forEach(({ path }) => {
  router.get(`/${path}`, (req, res, next) => {
    req.params.formPath = path;
    return ropaController.getFormItems(req, res, next);
  });

  router.post(`/${path}`, (req, res, next) => {
    req.params.formPath = path;
    return ropaController.createFormItem(req, res, next);
  });

  router.delete(`/${path}/:id`, (req, res, next) => {
    req.params.formPath = path;
    return ropaController.deleteFormItem(req, res, next);
  });
});

module.exports = router;
