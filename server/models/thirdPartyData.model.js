/**
 * Third-Party Data & Nominee Model (Form 11, Section 14)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const ThirdPartyData = sequelize.define(
  "ThirdPartyData",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    third_party_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    principal_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    nominee_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    relationship: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    tableName: "dpdp_third_party_data",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = ThirdPartyData;
