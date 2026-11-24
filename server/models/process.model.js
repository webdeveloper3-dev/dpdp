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
    department_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    process_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    process_description: {
      type: DataTypes.TEXT,
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
