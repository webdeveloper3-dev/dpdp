/**
 * Organisational Function Model (Form 01, Part C)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const BusinessFunction = sequelize.define(
  "BusinessFunction",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    function_id: {
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
    function_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    exists_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_functions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = BusinessFunction;
