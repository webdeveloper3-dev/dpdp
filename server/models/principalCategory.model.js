/**
 * Data Principal Category Model (Form 06)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const PrincipalCategory = sequelize.define(
  "PrincipalCategory",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    category_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    is_minor_category: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    special_safeguards_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "dpdp_principal_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = PrincipalCategory;
