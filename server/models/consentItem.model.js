/**
 * Granular Purpose-Wise Consent Line Item Model (Section 6)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const ConsentItem = sequelize.define(
  "ConsentItem",
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    consent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purpose_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    is_granted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    tableName: "dpdp_consent_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = ConsentItem;
