/**
 * Department Model (Form 01, Part B)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Department = sequelize.define(
  "Department",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    department_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    department_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    department_head_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    department_head_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: "dpdp_departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Department;
