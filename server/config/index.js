/**
 * Unified Application Configuration
 */

const fs = require("node:fs");
const path = require("node:path");

// Robust .env file loader for Node.js
function loadEnv() {
  const envCandidates = [
    path.resolve(__dirname, "..", ".env"),
    path.resolve(__dirname, "..", "..", ".env"),
    path.resolve(process.cwd(), ".env")
  ];

  for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(envPath);
        } else {
          const content = fs.readFileSync(envPath, "utf8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
              const eqIdx = trimmed.indexOf("=");
              if (eqIdx > 0) {
                const key = trimmed.slice(0, eqIdx).trim();
                const val = trimmed.slice(eqIdx + 1).trim();
                if (!(key in process.env)) {
                  process.env[key] = val;
                }
              }
            }
          }
        }
        break;
      } catch (err) {
        try {
          const content = fs.readFileSync(envPath, "utf8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
              const eqIdx = trimmed.indexOf("=");
              if (eqIdx > 0) {
                const key = trimmed.slice(0, eqIdx).trim();
                const val = trimmed.slice(eqIdx + 1).trim();
                if (!(key in process.env)) {
                  process.env[key] = val;
                }
              }
            }
          }
          break;
        } catch (e) {}
      }
    }
  }
}
loadEnv();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || "0.0.0.0",
  defaultTenantId: process.env.DEFAULT_TENANT_ID || "ASCII_GROUP",
  act: "Digital Personal Data Protection Act 2023 (Republic of India)",
  db: {
    database: (process.env.DB_NAME && process.env.DB_NAME.trim()) || "dpdp",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  crypto: {
    algorithm: "aes-256-gcm",
    ivLength: 12,
    masterKey: Buffer.from(
      process.env.MASTER_ENCRYPTION_KEY ||
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "hex"
    ),
    blindIndexSecret:
      process.env.BLIND_INDEX_SECRET || "dpdp_secret_blind_index_salt_key_2026"
  }
};
