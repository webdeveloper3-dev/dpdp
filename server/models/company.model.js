/**
 * Operating Company / Branch / Business Unit Model (Under Entity)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Company = sequelize.define(
  "Company",
  {
    tenant_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    company_id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false
    },
    entity_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(255),
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
    branch_locations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    staff_permanent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    staff_contract: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    staff_outsourced: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "dpdp_companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Company;
