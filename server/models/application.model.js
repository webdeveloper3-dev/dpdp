/**
 * Application & Software Register Model (Form 03)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Application = sequelize.define(
  "Application",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    app_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    app_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    app_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hosting_environment: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    data_residency_country: {
      type: DataTypes.STRING(100),
      defaultValue: "India"
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "dpdp_applications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Application;
