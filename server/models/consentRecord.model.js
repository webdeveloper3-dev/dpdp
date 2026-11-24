/**
 * Consent Record Model (Form 13, Section 6)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const ConsentRecord = sequelize.define(
  "ConsentRecord",
  {
    consent_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tenant_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    principal_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    notice_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    notice_version: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    consent_status: {
      type: DataTypes.ENUM("GIVEN", "WITHDRAWN", "EXPIRED"),
      defaultValue: "GIVEN",
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    consent_signature_hash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    is_minor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    guardian_principal_id: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    given_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    withdrawn_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    withdrawal_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_consent_records",
    timestamps: true,
    createdAt: "given_at",
    updatedAt: false
  }
);

module.exports = ConsentRecord;
