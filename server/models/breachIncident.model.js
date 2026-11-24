/**
 * Security Safeguards & Breach Incident Model (Form 12, Section 8(6))
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const BreachIncident = sequelize.define(
  "BreachIncident",
  {
    incident_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    incident_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    severity_level: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
      allowNull: false
    },
    affected_principals_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reported_to_dpbi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dpbi_reported_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    principals_notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    principals_notified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remediation_steps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discovered_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: "dpdp_breach_incidents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = BreachIncident;
