/**
 * Legal Entity / Organisation Profile Model (Form 01, Part A)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Entity = sequelize.define(
  "Entity",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    entity_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    entity_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    entity_type: {
      type: DataTypes.STRING(60),
      defaultValue: "Company"
    },
    registered_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    head_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    head_designation: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    handles_minors_under_18: {
      type: DataTypes.STRING(20),
      defaultValue: "No"
    },
    privacy_contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    outsourced_agencies: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_entities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Entity;
