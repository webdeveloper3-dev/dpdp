/**
 * Roles & RBAC Access Matrix Model (Form 09)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const AccessMatrix = sequelize.define(
  "AccessMatrix",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    matrix_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data_element: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    access_permission: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_access_matrix",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = AccessMatrix;
