/**
 * Collection Point Model (Form 05)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const CollectionPoint = sequelize.define(
  "CollectionPoint",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    point_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    point_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    channel_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_notice_displayed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "dpdp_collection_points",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = CollectionPoint;
