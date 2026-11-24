/**
 * Audit Disposal Log Model
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const DisposalLog = sequelize.define(
  "DisposalLog",
  {
    disposal_id: {
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
    purpose_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    disposal_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    records_shredded_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    authorized_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    disposal_certificate_hash: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    disposed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "dpdp_disposal_log",
    timestamps: true,
    createdAt: "disposed_at",
    updatedAt: false
  }
);

module.exports = DisposalLog;
