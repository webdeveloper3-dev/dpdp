/**
 * Client Model (Multi-Tenant Enterprise Register)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Client = sequelize.define(
  "Client",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    entity_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dpo_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    dpo_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true }
    },
    dpo_phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    api_key: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "ACTIVE"
    }
  },
  {
    tableName: "dpdp_clients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Client;
