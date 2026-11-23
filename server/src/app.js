/**
 * ====================================================================
 * GENERALIZED DPDP ENGINE - EXPRESS APPLICATION
 * ====================================================================
 */

const { express, cors } = require("./lib/express");
const { dpdpAuditLogger } = require("./middleware/auditLogger");

// Route modules
const noticeRoutes = require("./routes/notice");
const consentRoutes = require("./routes/consent");
const dsrRoutes = require("./routes/dsr");
const grievanceRoutes = require("./routes/grievance");
const breachRoutes = require("./routes/breach");
const ropaRoutes = require("./routes/ropa");
const cryptoDemoRoutes = require("./routes/cryptoDemo");
const clientRoutes = require("./routes/clients");

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dpdpAuditLogger());

// Healthcheck & Metadata
app.get("/api/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "Generalized DPDP Compliance Engine & Microservice",
    version: "2.0.0",
    architecture: "Multi-Tenant Enterprise SaaS for Service Companies (ASCII Online Solutions)",
    act: "Digital Personal Data Protection Act 2023 (Republic of India)",
    timestamp: new Date().toISOString()
  });
});

// Mount Compliance Routes
app.use("/api/dpdp/clients", clientRoutes);
app.use("/api/dpdp/notice", noticeRoutes);
app.use("/api/dpdp/consent", consentRoutes);
app.use("/api/dpdp/dsr", dsrRoutes);
app.use("/api/dpdp/grievance", grievanceRoutes);
app.use("/api/dpdp/breach", breachRoutes);
app.use("/api/dpdp/ropa", ropaRoutes);
app.use("/api/dpdp/crypto", cryptoDemoRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} not found on DPDP Engine`
  });
});

module.exports = app;
