const express = require("express");
const cryptoController = require("../controller/crypto.controller");
const { dpdpConsentGuard } = require("../middleware/consentGuard");

const router = express.Router();

router.post("/demo-encrypt", (req, res, next) => cryptoController.demoEncrypt(req, res, next));

router.get(
  "/protected-data/:principalId",
  dpdpConsentGuard({ purposeCode: "ERP_AUTH_DELEGATION" }),
  (req, res, next) => cryptoController.getProtectedData(req, res, next)
);

module.exports = router;
