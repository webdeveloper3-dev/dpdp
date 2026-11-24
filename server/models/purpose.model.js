/**
 * Processing Purpose Model (Form 07)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Purpose = sequelize.define(
  "Purpose",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    purpose_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    purpose_code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    purpose_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lawful_basis: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    retention_period_months: {
      type: DataTypes.INTEGER,
      defaultValue: 36
    }
  },
  {
    tableName: "dpdp_purposes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Purpose;
