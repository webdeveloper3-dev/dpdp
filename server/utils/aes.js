/**
 * ====================================================================
 * FIELD-LEVEL ENCRYPTION (AES-256-GCM) - SECTION 8(5)
 * ====================================================================
 * Prevents plain-text storage of Aadhaar, PAN, Bank Details, Passports.
 * Format: Base64(IV) + ":" + Base64(AuthTag) + ":" + Base64(Ciphertext)
 */

const crypto = require("node:crypto");
const config = require("../config");

const ALGORITHM = config.crypto.algorithm;
const IV_LENGTH = config.crypto.ivLength;
const DEFAULT_KEY = config.crypto.masterKey;

/**
 * Encrypt plain-text string with AES-256-GCM
 * @param {string} text Plaintext to encrypt
 * @param {Buffer} [key] Optional 32-byte key
 * @returns {string} Encrypted payload
 */
function encrypt(text, key = DEFAULT_KEY) {
  if (text === null || text === undefined || text === "") return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(String(text), "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM payload
 * @param {string} payload iv:authTag:ciphertext
 * @param {Buffer} [key] Optional 32-byte key
 * @returns {string} Decrypted plaintext
 */
function decrypt(payload, key = DEFAULT_KEY) {
  if (!payload || typeof payload !== "string" || !payload.includes(":")) {
    return payload;
  }

  const parts = payload.split(":");
  if (parts.length !== 3) return payload;

  const [ivBase64, authTagBase64, encryptedBase64] = parts;
  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};
