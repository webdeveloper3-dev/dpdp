/**
 * Data Principal Rights (DSR) Request Model (Sections 11, 12, 14)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const DsrRequest = sequelize.define(
  "DsrRequest",
  {
    request_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    principal_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    request_type: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    request_status: {
      type: DataTypes.ENUM("SUBMITTED", "IN_REVIEW", "ACTION_TAKEN", "REJECTED"),
      defaultValue: "SUBMITTED",
      allowNull: false
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    export_file_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sla_deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_dsr_requests",
    timestamps: true,
    createdAt: "submitted_at",
    updatedAt: false
  }
);

module.exports = DsrRequest;
