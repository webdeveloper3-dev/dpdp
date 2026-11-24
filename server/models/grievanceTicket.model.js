/**
 * Grievance Redressal Ticket Model (Section 13)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const GrievanceTicket = sequelize.define(
  "GrievanceTicket",
  {
    ticket_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    principal_id: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    complaint_summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ticket_status: {
      type: DataTypes.ENUM("OPEN", "ASSIGNED_TO_DPO", "RESOLVED", "ESCALATED_TO_DPBI"),
      defaultValue: "OPEN",
      allowNull: false
    },
    dpo_response_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sla_deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "dpdp_grievance_tickets",
    timestamps: true,
    createdAt: "submitted_at",
    updatedAt: false
  }
);

module.exports = GrievanceTicket;
