/**
 * ====================================================================
 * DPDP CONSENT GUARD MIDDLEWARE (SECTION 6)
 * ====================================================================
 * Intercepts incoming API routes in client applications to verify that
 * the Data Principal has an ACTIVE, UNREVOKED consent for the requested purpose.
 * Halts execution with HTTP 403 Forbidden if consent is missing or withdrawn.
 */

const db = require("../database/db");

/**
 * Express middleware to enforce active consent for a specific purpose
 * @param {Object} options
 * @param {string} options.purposeCode e.g., "CORE_SERVICE", "MARKETING_COMMUNICATIONS"
 * @param {Function} [options.getPrincipalId] Optional extractor fn
 */
function dpdpConsentGuard(options = {}) {
  const { purposeCode, getPrincipalId } = options;

  if (!purposeCode) {
    throw new Error("[dpdpConsentGuard] purposeCode is mandatory");
  }

  return async (req, res, next) => {
    try {
      const tenantId = req.headers["x-tenant-id"] || process.env.DEFAULT_TENANT_ID || "ASCII_GROUP";

      const principalId = getPrincipalId
        ? getPrincipalId(req)
        : (req.user && req.user.id) || req.headers["x-principal-id"] || req.params.principalId || req.query.principalId;

      if (!principalId) {
        return res.status(400).json({
          success: false,
          errorCode: "MISSING_PRINCIPAL_ID",
          message: "DPDP Guard: Missing Data Principal identity (x-principal-id header or param required)"
        });
      }

      // 1. Look up Purpose ID from purposeCode
      const purpose = await db.get("dpdp_purposes", p => p.tenant_id === tenantId && p.purpose_code === purposeCode);
      if (!purpose) {
        return res.status(404).json({
          success: false,
          errorCode: "UNKNOWN_PURPOSE",
          message: `DPDP Guard: Purpose code '${purposeCode}' is not registered in Form 07 catalog`
        });
      }

      // If legitimate use under Section 7 (e.g. legal obligation / employment), bypass consent check
      if (purpose.lawful_basis && (purpose.lawful_basis.includes("LEGITIMATE_USES") || purpose.lawful_basis.includes("EMPLOYMENT"))) {
        req.dpdpLawfulBasis = purpose.lawful_basis;
        return next();
      }

      // 2. Fetch the most recent consent record for this user
      const consents = await db.all(
        "dpdp_consent_records",
        c => c.tenant_id === tenantId && c.principal_id === String(principalId)
      );

      if (!consents || consents.length === 0) {
        return res.status(403).json({
          success: false,
          errorCode: "NO_CONSENT_FOUND",
          message: `DPDP Guard: No consent record found for Data Principal ${principalId}. Access denied under Section 6.`,
          requiredAction: "OBTAIN_CONSENT",
          purposeRequested: purposeCode
        });
      }

      // Find newest record
      const latestConsent = consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at))[0];

      if (latestConsent.consent_status === "WITHDRAWN") {
        return res.status(403).json({
          success: false,
          errorCode: "CONSENT_WITHDRAWN",
          message: `DPDP Guard: Consent was revoked on ${latestConsent.withdrawn_at}. Processing strictly halted under Section 6(4).`,
          requiredAction: "RE_OPT_IN",
          purposeRequested: purposeCode
        });
      }

      // 3. Verify granular purpose item
      const consentItem = await db.get(
        "dpdp_consent_items",
        ci => (ci.consent_id === latestConsent.consent_id || ci.consent_record_id === latestConsent.consent_id) && ci.purpose_id === purpose.purpose_id
      );

      if (!consentItem || !consentItem.is_granted) {
        return res.status(403).json({
          success: false,
          errorCode: "GRANULAR_PURPOSE_OPTED_OUT",
          message: `DPDP Guard: User opted out of purpose '${purpose.purpose_description}' (${purposeCode}). Processing prohibited.`,
          requiredAction: "GRANT_PURPOSE_CONSENT",
          purposeRequested: purposeCode
        });
      }

      // Attach consent audit metadata
      req.dpdpConsent = {
        verified: true,
        recordId: latestConsent.id,
        principalId: latestConsent.principal_id,
        purposeCode,
        grantedAt: latestConsent.given_at,
        receiptHash: latestConsent.consent_signature_hash
      };

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "DPDP Guard internal failure: " + err.message
      });
    }
  };
}

module.exports = {
  dpdpConsentGuard
};
