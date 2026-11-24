/**
 * Multilingual Privacy Notice Model (Form 13, Section 5)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Notice = sequelize.define(
  "Notice",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    notice_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    version_tag: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    language_code: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: "en"
    },
    notice_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    notice_body_markdown: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dpo_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    dpo_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dpo_phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "dpdp_notices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Notice;
