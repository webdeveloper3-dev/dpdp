/**
 * Technical Safeguards Model (Form 12, Section 8(5))
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const SecuritySafeguard = sequelize.define(
  "SecuritySafeguard",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    safeguard_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    safeguard_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    control_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    implementation_status: {
      type: DataTypes.STRING(50),
      defaultValue: "DEPLOYED"
    },
    audit_frequency: {
      type: DataTypes.STRING(50),
      defaultValue: "ANNUAL"
    }
  },
  {
    tableName: "dpdp_security_safeguards",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = SecuritySafeguard;
