/**
 * Personal Data Catalog Model (Form 02)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const DataCatalog = sequelize.define(
  "DataCatalog",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    item_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    process_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    data_element_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    classification_level: {
      type: DataTypes.ENUM("CRITICAL", "HIGH", "MEDIUM", "LOW"),
      allowNull: false
    },
    storage_format: {
      type: DataTypes.STRING(30),
      defaultValue: "ENCRYPTED_TEXT"
    },
    has_blind_index: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "dpdp_data_catalog",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = DataCatalog;
