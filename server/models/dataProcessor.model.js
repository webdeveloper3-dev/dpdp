/**
 * Data Processor & Vendor Model (Form 10)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const DataProcessor = sequelize.define(
  "DataProcessor",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    processor_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    processor_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    service_provided: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    dpa_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    data_shared_categories: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country_hosted: {
      type: DataTypes.STRING(100),
      defaultValue: "India"
    }
  },
  {
    tableName: "dpdp_data_processors",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = DataProcessor;
