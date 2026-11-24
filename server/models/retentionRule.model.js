/**
 * Retention Rule Model (Form 08, Section 8(7))
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const RetentionRule = sequelize.define(
  "RetentionRule",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    rule_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    purpose_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    retention_period_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trigger_event: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    disposal_action: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    legal_hold_justification: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_retention_rules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = RetentionRule;
