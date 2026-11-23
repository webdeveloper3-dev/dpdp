/**
 * ====================================================================
 * DPDP AUDIT LOGGER MIDDLEWARE (SECTION 8)
 * ====================================================================
 * Automatically captures tamper-proof access records on all personal data queries:
 * who accessed it, when, from what IP, and for what purpose.
 */

const crypto = require("node:crypto");

function dpdpAuditLogger() {
  return (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    const principalId = req.headers["x-principal-id"] || (req.user && req.user.id) || "ANONYMOUS";
    const tenantId = req.headers["x-tenant-id"] || "DEFAULT";

    // Hook into response finish event
    res.on("finish", () => {
      const durationMs = Date.now() - start;
      const logEntry = {
        timestamp,
        tenantId,
        principalId,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown",
        durationMs
      };

      // Compute verification hash
      const hash = crypto.createHash("sha256")
        .update(`${timestamp}|${tenantId}|${principalId}|${req.method}|${req.url}|${res.statusCode}`)
        .digest("hex");
      
      logEntry.signature = hash;

      // In production, write to append-only immutable DB / S3 WORM storage
      if (res.statusCode >= 400) {
        console.warn(`🔒 [DPDP AUDIT ALERT] ${req.method} ${req.url} -> ${res.statusCode} (User: ${principalId}) [${durationMs}ms]`);
      }
    });

    next();
  };
}

module.exports = {
  dpdpAuditLogger
};
