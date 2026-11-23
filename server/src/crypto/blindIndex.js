/**
 * ====================================================================
 * BLIND INDEXING (HMAC-SHA256) - SECTION 8(5)
 * ====================================================================
 * Enables deterministic fast searching (SELECT * FROM users WHERE phone_blind_idx = ?)
 * on encrypted columns without decrypting other database rows.
 */

const crypto = require("node:crypto");

const BLIND_INDEX_SECRET = process.env.BLIND_INDEX_SECRET || "dpdp_secret_blind_index_salt_key_2026";

/**
 * Normalize sensitive string before hashing (removes whitespace, lowercases)
 * @param {string} value 
 * @returns {string} Normalized string
 */
function normalize(value) {
  if (!value) return "";
  return String(value).trim().toLowerCase().replace(/[\s-]/g, "");
}

/**
 * Generate HMAC-SHA256 Blind Index
 * @param {string} rawValue Plaintext e.g. Phone, Email, PAN
 * @param {string} [secret] 
 * @returns {string} 64-char hex blind index
 */
function generateBlindIndex(rawValue, secret = BLIND_INDEX_SECRET) {
  if (!rawValue) return null;
  const normalized = normalize(rawValue);
  return crypto.createHmac("sha256", secret).update(normalized).digest("hex");
}

module.exports = {
  normalize,
  generateBlindIndex
};
