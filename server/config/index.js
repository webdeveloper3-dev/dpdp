/**
 * Unified Application Configuration
 */

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || "0.0.0.0",
  defaultTenantId: process.env.DEFAULT_TENANT_ID || "ASCII_GROUP",
  act: "Digital Personal Data Protection Act 2023 (Republic of India)",
  db: {
    database: process.env.DB_NAME || "dpdp_compliance",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: "mysql",
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
