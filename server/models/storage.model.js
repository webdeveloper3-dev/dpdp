/**
 * Storage Location Model (Form 04)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const StorageLocation = sequelize.define(
  "StorageLocation",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    storage_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    storage_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    storage_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    geographic_location: {
      type: DataTypes.STRING(100),
      defaultValue: "India (ap-south-1)"
    },
    encryption_at_rest: {
      type: DataTypes.STRING(50),
      defaultValue: "AES_256_GCM"
    },
    access_control_mechanism: {
      type: DataTypes.STRING(100),
      defaultValue: "RBAC_LEAST_PRIVILEGE"
    }
  },
  {
    tableName: "dpdp_storage_locations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = StorageLocation;
