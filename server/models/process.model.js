/**
 * Business Process Model (Form 01, Part C)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const BusinessProcess = sequelize.define(
  "BusinessProcess",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    process_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    entity_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    company_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    department_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    function_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    process_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    process_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    frequency: {
      type: DataTypes.STRING(50),
      defaultValue: "Daily"
    },
    format: {
      type: DataTypes.STRING(30),
      defaultValue: "Digital"
    },
    involves_personal_data: {
      type: DataTypes.STRING(20),
      defaultValue: "Yes"
    },
    other_departments: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    risk_level: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
      defaultValue: "MEDIUM"
    }
  },
  {
    tableName: "dpdp_business_processes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = BusinessProcess;
