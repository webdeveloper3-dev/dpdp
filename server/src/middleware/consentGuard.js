/**
 * ====================================================================
 * DPDP CONSENT GUARD MIDDLEWARE (SECTION 6)
 * ====================================================================
 * Intercepts incoming API routes in client applications to verify that
 * the Data Principal has an ACTIVE, UNREVOKED consent for the requested purpose.
 * Halts execution with HTTP 403 Forbidden if consent is missing or withdrawn.
 */

const db = require("../../database/db");

/**
 * Express middleware to enforce active consent for a specific purpose
 * @param {Object} options
 * @param {string} options.purposeCode e.g., "CORE_SERVICE", "MARKETING_COMMUNICATIONS"
 * @param {Function} [options.getPrincipalId] Optional extractor fn (defaults to req.user.id or req.params.principalId)
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
      if (purpose.lawful_basis.includes("LEGITIMATE_USES") || purpose.lawful_basis.includes("EMPLOYMENT")) {
        req.dpdpLawfulBasis = purpose.lawful_basis;
        return next();
      }

      // 2. Fetch the most recent consent record for this user
      const consents = await db.all("dpdp_consent_records", c => 
        c.tenant_id === tenantId && c.principal_id === String(principalId)
      );

      if (consents.length === 0) {
        return res.status(403).json({
          success: false,
          errorCode: "CONSENT_NOT_FOUND",
          message: "DPDP Guard: No consent record found for Data Principal. Prompt user with active notice."
        });
      }

      // Sort to get latest
      consents.sort((a, b) => new Date(b.given_at) - new Date(a.given_at));
      const latestConsent = consents[0];

      if (latestConsent.consent_status !== "GIVEN") {
        return res.status(403).json({
          success: false,
          errorCode: "CONSENT_WITHDRAWN",
          message: `DPDP Guard: Consent was WITHDRAWN by Data Principal at ${latestConsent.withdrawn_at || "earlier"}. Processing halted under Section 6(4).`
        });
      }

      // 3. Check granular purpose checkbox in dpdp_consent_items
      const consentItem = await db.get("dpdp_consent_items", item => 
        item.consent_id === latestConsent.consent_id && item.purpose_id === purpose.purpose_id
      );

      if (!consentItem || !consentItem.is_granted) {
        return res.status(403).json({
          success: false,
          errorCode: "PURPOSE_NOT_GRANTED",
          message: `DPDP Guard: Consent was NOT granted for specific purpose '${purposeCode}' (Itemized checkbox unchecked).`
        });
      }

      // Attach compliance context to request
      req.dpdpConsent = {
        consentId: latestConsent.consent_id,
        status: "ACTIVE",
        purposeId: purpose.purpose_id,
        purposeCode: purpose.purpose_code,
        signature: latestConsent.consent_signature_hash
      };

      return next();
    } catch (err) {
      console.error("[dpdpConsentGuard] Error during verification:", err);
      return res.status(500).json({
        success: false,
        errorCode: "DPDP_GUARD_INTERNAL_ERROR",
        message: err.message
      });
    }
  };
}

module.exports = {
  dpdpConsentGuard
};
