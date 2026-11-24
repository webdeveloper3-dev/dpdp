/**
 * ====================================================================
 * DYNAMIC ROLE-BASED DATA MASKING (SECTION 8(5))
 * ====================================================================
 * Redacts sensitive PII attributes in outbound API responses for non-admins.
 */

/**
 * Mask Aadhaar: e.g., "XXXXXXXX1234" (shows only last 4 digits)
 */
function maskAadhaar(aadhaar) {
  if (!aadhaar) return aadhaar;
  const cleaned = String(aadhaar).replace(/[\s-]/g, "");
  if (cleaned.length < 4) return "XXXXXXXX";
  const last4 = cleaned.slice(-4);
  return `XXXXXXXX${last4}`;
}

/**
 * Mask Mobile: e.g., "XXXXXX7890" (shows only last 4 digits)
 */
function maskMobile(mobile) {
  if (!mobile) return mobile;
  const cleaned = String(mobile).replace(/[\s+-]/g, "");
  if (cleaned.length < 4) return "XXXXXX";
  const last4 = cleaned.slice(-4);
  return `XXXXXX${last4}`;
}

/**
 * Mask PAN: e.g., "XXXXX1234X" (shows only 4 numbers and last letter)
 */
function maskPAN(pan) {
  if (!pan) return pan;
  const cleaned = String(pan).trim();
  if (cleaned.length < 5) return "XXXXX";
  return `XXXXX${cleaned.slice(5)}`;
}

/**
 * Mask Email: e.g., "g*****s@example.com"
 */
function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  return `${first}${"*".repeat(Math.max(3, localPart.length - 2))}${last}@${domain}`;
}

module.exports = {
  maskAadhaar,
  maskMobile,
  maskPAN,
  maskEmail
};
