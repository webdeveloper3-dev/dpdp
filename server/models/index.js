/**
 * Centralized Sequelize MySQL Models & Associations Hub
 */

const { Sequelize } = require("sequelize");
const sequelize = require("../database/sequelize");

// Import All Models
const Client = require("./client.model");
const Department = require("./department.model");
const BusinessProcess = require("./process.model");
const Application = require("./application.model");
const StorageLocation = require("./storage.model");
const CollectionPoint = require("./collectionPoint.model");
const PrincipalCategory = require("./principalCategory.model");
const DataCatalog = require("./dataCatalog.model");
const Purpose = require("./purpose.model");
const AccessMatrix = require("./accessMatrix.model");
const DataProcessor = require("./dataProcessor.model");
const ThirdPartyData = require("./thirdPartyData.model");
const SecuritySafeguard = require("./securitySafeguard.model");
const Notice = require("./notice.model");
const ConsentRecord = require("./consentRecord.model");
const ConsentItem = require("./consentItem.model");
const DsrRequest = require("./dsrRequest.model");
const GrievanceTicket = require("./grievanceTicket.model");
const RetentionRule = require("./retentionRule.model");
const DisposalLog = require("./disposalLog.model");
const BreachIncident = require("./breachIncident.model");

// Model Associations
Client.hasMany(Department, { foreignKey: "tenant_id", onDelete: "CASCADE" });
Department.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(BusinessProcess, { foreignKey: "tenant_id", onDelete: "CASCADE" });
BusinessProcess.belongsTo(Client, { foreignKey: "tenant_id" });

ConsentRecord.hasMany(ConsentItem, { foreignKey: "consent_id", as: "items", onDelete: "CASCADE" });
ConsentItem.belongsTo(ConsentRecord, { foreignKey: "consent_id" });

Client.hasMany(ConsentRecord, { foreignKey: "tenant_id" });
ConsentRecord.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(Notice, { foreignKey: "tenant_id" });
Notice.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(Purpose, { foreignKey: "tenant_id" });
Purpose.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(DsrRequest, { foreignKey: "tenant_id" });
DsrRequest.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(GrievanceTicket, { foreignKey: "tenant_id" });
GrievanceTicket.belongsTo(Client, { foreignKey: "tenant_id" });

Client.hasMany(BreachIncident, { foreignKey: "tenant_id" });
BreachIncident.belongsTo(Client, { foreignKey: "tenant_id" });

const db = {
  sequelize,
  Sequelize,
  Client,
  Department,
  BusinessProcess,
  Application,
  StorageLocation,
  CollectionPoint,
  PrincipalCategory,
  DataCatalog,
  Purpose,
  AccessMatrix,
  DataProcessor,
  ThirdPartyData,
  SecuritySafeguard,
  Notice,
  ConsentRecord,
  ConsentItem,
  DsrRequest,
  GrievanceTicket,
  RetentionRule,
  DisposalLog,
  BreachIncident
};

module.exports = db;
