/**
 * ====================================================================
 * TRAIL-DELEGATION ERP — COMPLETE 13-FORM DPDP SEED DATA
 * ====================================================================
 * Maps the real Trail-Delegation ERP architecture (Server/, erp_web_updated/,
 * erp_mobile_app/, portal/) across all 13 Statutory DPDP Forms & Consent Ledger.
 */

const db = require("./db");

async function seed() {
  console.log("🌱 Seeding Complete 13-Form DPDP Database for Trail-Delegation ERP...");
  db.reset();

  // ==================================================================
  // MASTER ERP TENANT: ASCII TRAIL-DELEGATION ERP
  // ==================================================================
  await db.insert("dpdp_clients", {
    tenant_id: "ASCII_GROUP",
    client_name: "ASCII Trail-Delegation ERP",
    entity_name: "ASCII Online Solutions Pvt. Ltd.",
    industry: "Enterprise ERP (HR, Payroll, Attendance & Task Delegation)",
    cin: "U72900MH2020PTC345678",
    pan: "AAACA1234D",
    dpo_name: "Gopal Gawas (Chief Compliance Officer)",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    api_key: "dpdp_live_ascii_master_key_2026",
    status: "ACTIVE",
    created_at: new Date().toISOString()
  });

  // Form 01: Departments (Trail-Delegation ERP Modules)
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-01",
    department_name: "Core HR, PIM & Employee Onboarding",
    department_head_name: "Ramesh Sharma",
    department_head_email: "hr@asciionline.com"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-02",
    department_name: "Payroll, Accounts & Statutory Filings",
    department_head_name: "Anita Deshmukh",
    department_head_email: "accounts@asciionline.com"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-03",
    department_name: "Attendance, Leave & Field Operations",
    department_head_name: "Vikram Kulkarni",
    department_head_email: "ops@asciionline.com"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-04",
    department_name: "Task Delegation, Activity Tracker & IT Security",
    department_head_name: "Tejas Sawant",
    department_head_email: "infosec@asciionline.com"
  });

  // Form 01: Business Processes (Mapped to Trail-Delegation Controllers)
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-01",
    department_id: "DEP-01",
    process_name: "Employee Onboarding, KYC & PIM Profile (personal_table, contact_table)",
    process_description: "Collecting employee identity, contact, address, education, work experience, emergency contacts & dependents",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-02",
    department_id: "DEP-02",
    process_name: "Monthly Payroll Runs, Payslips & PF/ESIC (accounts_table, payroll_runs)",
    process_description: "Salary structure calculation, bank ACH payouts, Aadhaar/PAN verification, PF & Form 16 TDS compliance",
    risk_level: "CRITICAL"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-03",
    department_id: "DEP-03",
    process_name: "Biometric Selfie, GPS Attendance & Medical Leaves (attendance_table, leaves_2025)",
    process_description: "Geofenced punch-in lat/long, selfie verification, sick leave medical certificates in Medicals/",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-04",
    department_id: "DEP-04",
    process_name: "Task Delegation, Daily Reports & Multi-Tenant Auth (auth_table, erp_activity_log)",
    process_description: "JWT authentication, role allocation, task delegation notifications, daily report submissions & audit logs",
    risk_level: "MEDIUM"
  });

  // Form 02: Personal Data Inventory (Exact Trail-Delegation PII Columns)
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-01",
    process_id: "PRO-02",
    data_element_name: "Aadhaar Number (accounts_table.adhar)",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-02",
    process_id: "PRO-02",
    data_element_name: "PAN Card Number (accounts_table.pan_card)",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-03",
    process_id: "PRO-02",
    data_element_name: "Bank Account, IFSC & PF Number (accounts_table)",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-04",
    process_id: "PRO-03",
    data_element_name: "Biometric Punch Selfies & Profile Photo (Uploads/)",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-05",
    process_id: "PRO-03",
    data_element_name: "Punch-In GPS Lat/Long Coordinates (attendance_table)",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-06",
    process_id: "PRO-01",
    data_element_name: "Mobile, Alternate Phone & Email (contact_table)",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-07",
    process_id: "PRO-03",
    data_element_name: "Blood Group & Sick Leave Medical Certificates (Medicals/)",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-08",
    process_id: "PRO-01",
    data_element_name: "Emergency Contacts & Dependent Info (dependent_info)",
    classification_level: "MEDIUM",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });

  // Form 03: Applications Inventory (Trail-Delegation ERP Apps)
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-01",
    app_name: "Trail-Delegation ERP Web Portal (erp_web_updated)",
    app_type: "WEB_APP",
    hosting_environment: "Cloud / On-Premise Node + React",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-02",
    app_name: "Trail-Delegation Mobile App (erp_mobile_app / Expo)",
    app_type: "MOBILE_APP",
    hosting_environment: "Android / iOS + Express API",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-03",
    app_name: "Trail-Delegation Admin & Tenant Portal (portal)",
    app_type: "WEB_APP",
    hosting_environment: "Internal Admin Network",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-04",
    app_name: "Trail-Delegation Express Backend API (Server/index.js)",
    app_type: "API_SERVICE",
    hosting_environment: "Node.js Express + Socket.IO",
    data_residency_country: "India",
    is_active: true
  });

  // Form 04: Storage Locations Register (Trail-Delegation MySQL & File Stores)
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STO-01",
    storage_name: "Master Auth & Tenant Routing MySQL (dbConnection1.js)",
    storage_type: "SQL_DATABASE",
    geographic_location: "India (MySQL Host)",
    encryption_at_rest: "AES_256_GCM",
    access_control_mechanism: "JWT_AND_RBAC_MIDDLEWARE"
  });
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STO-02",
    storage_name: "Per-Tenant ERP MySQL Databases (Services/getTenantDb.js)",
    storage_type: "SQL_DATABASE",
    geographic_location: "India (Isolated Tenant DBs)",
    encryption_at_rest: "AES_256_GCM",
    access_control_mechanism: "ENTITY_ID_POOL_ISOLATION"
  });
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STO-03",
    storage_name: "ERP Media & KYC File Folders (Server/Uploads, Medicals, DailyReportFiles)",
    storage_type: "FILE_SERVER",
    geographic_location: "India (Local / Server Volume)",
    encryption_at_rest: "OS_LEVEL_ENCRYPTION",
    access_control_mechanism: "AUTH_MIDDLEWARE_PROTECTED"
  });

  // Form 05: Collection Points
  await db.insert("dpdp_collection_points", {
    tenant_id: "ASCII_GROUP",
    point_id: "COL-01",
    point_name: "ERP Web My Info & Employee Onboarding (erp_web_updated)",
    channel_type: "WEB_PORTAL",
    is_notice_displayed: true,
    is_active: true
  });
  await db.insert("dpdp_collection_points", {
    tenant_id: "ASCII_GROUP",
    point_id: "COL-02",
    point_name: "ERP Mobile Biometric Selfie & GPS Punch-In (erp_mobile_app)",
    channel_type: "MOBILE_APP",
    is_notice_displayed: true,
    is_active: true
  });
  await db.insert("dpdp_collection_points", {
    tenant_id: "ASCII_GROUP",
    point_id: "COL-03",
    point_name: "Bulk Employee CSV Import (insertCSVDataWIthCredentials.js)",
    channel_type: "INTERNAL_IMPORT",
    is_notice_displayed: true,
    is_active: true
  });

  // Form 06: Data Principal Categories
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-01",
    category_name: "Full-Time Employees & Supervisors",
    is_minor_category: false,
    special_safeguards_required: false
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-02",
    category_name: "Contractors, Interns & Job Applicants",
    is_minor_category: false,
    special_safeguards_required: false
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-03",
    category_name: "Employee Minor Dependents (< 18 Years, Sec 9)",
    is_minor_category: true,
    special_safeguards_required: true
  });

  // Form 07: Purposes & Lawful Basis
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-01",
    purpose_code: "ERP_AUTH_DELEGATION",
    purpose_description: "ERP login (auth_table), role-based access, task delegation & daily report tracking",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: true,
    retention_period_months: 36
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-02",
    purpose_code: "PAYROLL_STATUTORY_PF_TDS",
    purpose_description: "Monthly salary disbursement, payslips, PF/ESIC & Form 16 TDS (accounts_table, payroll_runs)",
    lawful_basis: "EMPLOYMENT_SEC_7I",
    is_mandatory: true,
    retention_period_months: 84
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-03",
    purpose_code: "ATTENDANCE_BIOMETRIC_GPS",
    purpose_description: "Punch-in selfie verification & geofenced GPS attendance tracking (attendance_table)",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: false,
    retention_period_months: 3
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-04",
    purpose_code: "MEDICAL_LEAVE_WELFARE",
    purpose_description: "Sick leave medical certificates (Medicals/) & emergency contact / dependent welfare",
    lawful_basis: "CERTAIN_LEGITIMATE_USES_SEC_7",
    is_mandatory: false,
    retention_period_months: 12
  });

  // Form 08: Retention Rules (Aligned with Trail-Delegation Blueprint)
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ASCII_GROUP",
    rule_id: "RET-01",
    purpose_id: "PUR-03",
    retention_period_days: 90,
    trigger_event: "PUNCH_CAPTURE",
    disposal_action: "CRYPTOGRAPHIC_SHREDDING"
  });
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ASCII_GROUP",
    rule_id: "RET-02",
    purpose_id: "PUR-02",
    retention_period_days: 2555,
    trigger_event: "EMPLOYEE_EXIT",
    disposal_action: "ANONYMIZE_AND_ARCHIVE"
  });
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ASCII_GROUP",
    rule_id: "RET-03",
    purpose_id: "PUR-04",
    retention_period_days: 365,
    trigger_event: "LEAVE_APPROVAL",
    disposal_action: "HARD_DELETE"
  });

  // Form 09: Access Matrix (Aligned with Trail-Delegation user_type_master)
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ASCII_GROUP",
    matrix_id: "ACC-01",
    role_name: "HR / Supervisor",
    data_element: "Aadhaar, Mobile & Attendance GPS",
    access_permission: "READ_MASKED",
    justification: "Operational supervision & attendance verification without exposing raw Aadhaar/mobile"
  });
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ASCII_GROUP",
    matrix_id: "ACC-02",
    role_name: "Payroll & Accounts Officer",
    data_element: "Bank Account, IFSC, PAN & Salary",
    access_permission: "READ_UNMASKED",
    justification: "Mandatory statutory processing for salary ACH & PF/TDS filings (logged in erp_activity_log)"
  });
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ASCII_GROUP",
    matrix_id: "ACC-03",
    role_name: "Super Admin / Entity Admin",
    data_element: "All Employee PII",
    access_permission: "READ_MASKED",
    justification: "System administration with audit-logged elevation required for unmasked view"
  });

  // Form 10: External Processors (Exact Trail-Delegation Services)
  await db.insert("dpdp_data_processors", {
    tenant_id: "ASCII_GROUP",
    processor_id: "PROC-01",
    processor_name: "Google Firebase Cloud Messaging (firebaseKey.json)",
    service_provided: "Mobile Push Notifications for Task Delegation & Leave Alerts",
    dpa_signed: true,
    data_shared_categories: "Device FCM Token, Task Title, Employee ID",
    country_hosted: "India / Global Cloud"
  });
  await db.insert("dpdp_data_processors", {
    tenant_id: "ASCII_GROUP",
    processor_id: "PROC-02",
    processor_name: "SMTP / Nodemailer Email Relay (sendEmailController.js)",
    service_provided: "Payslip Delivery, Password Reset & Attendance Alerts",
    dpa_signed: true,
    data_shared_categories: "Employee Email, Name, Notification Subject",
    country_hosted: "India"
  });

  // Form 11: Third-Party Personal Data Register (Nominees - Section 14)
  await db.insert("dpdp_third_party_data", {
    tenant_id: "ASCII_GROUP",
    third_party_id: "TPD-01",
    principal_id: "EMP_1001",
    nominee_name: "Sunita Gawas",
    relationship: "Spouse (Emergency Contact & Sec 14 Nominee)",
    contact_phone: "+91 98200 44332"
  });

  // Form 12: Security Safeguards (Section 8(5))
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ASCII_GROUP",
    safeguard_id: "SAF-01",
    safeguard_title: "AES-256-GCM Encryption & HMAC-SHA256 Blind Index (accounts_table)",
    control_type: "ENCRYPTION_AT_REST",
    implementation_status: "DEPLOYED",
    audit_frequency: "CONTINUOUS"
  });
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ASCII_GROUP",
    safeguard_id: "SAF-02",
    safeguard_title: "JWT Auth & Per-Tenant DB Pool Isolation (Middleware/auth.js)",
    control_type: "ACCESS_CONTROL",
    implementation_status: "DEPLOYED",
    audit_frequency: "CONTINUOUS"
  });
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ASCII_GROUP",
    safeguard_id: "SAF-03",
    safeguard_title: "PII Access & Export Audit Trail (erp_activity_log)",
    control_type: "AUDIT_LOGGING",
    implementation_status: "DEPLOYED",
    audit_frequency: "CONTINUOUS"
  });

  // Form 13: Multilingual Notices (Trail-Delegation ERP)
  await db.insert("dpdp_notices", {
    tenant_id: "ASCII_GROUP",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "en",
    notice_title: "ASCII Trail-Delegation ERP Privacy Notice (DPDP Act 2023)",
    notice_body_markdown: "ASCII Trail-Delegation ERP processes employee KYC (Aadhaar, PAN, Bank Account), biometric/GPS attendance, leave medical records, and task delegation logs strictly for HR, payroll, and workplace operations under the Digital Personal Data Protection Act 2023. You may view your data, request correction or erasure, withdraw optional consents, or nominate a representative under Section 14.",
    dpo_name: "Gopal Gawas",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    is_active: true
  });
  await db.insert("dpdp_notices", {
    tenant_id: "ASCII_GROUP",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "hi",
    notice_title: "ASCII Trail-Delegation ERP गोपनीयता सूचना (DPDP अधिनियम 2023)",
    notice_body_markdown: "ASCII Trail-Delegation ERP कर्मचारी KYC (आधार, पैन, बैंक खाता), बायोमेट्रिक/GPS उपस्थिति, अवकाश और कार्य प्रबंधन के लिए DPDP अधिनियम 2023 के तहत व्यक्तिगत डेटा संसाधित करता है। आपको डेटा देखने, सुधारने, हटाने या वैकल्पिक सहमति वापस लेने का अधिकार है।",
    dpo_name: "गोपाल गावस",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    is_active: true
  });
  await db.insert("dpdp_notices", {
    tenant_id: "ASCII_GROUP",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "mr",
    notice_title: "ASCII Trail-Delegation ERP गोपनीयता सूचना (DPDP कायदा २०२३)",
    notice_body_markdown: "ASCII Trail-Delegation ERP कर्मचारी KYC (आधार, पॅन, बँक खाते), बायोमेट्रिक/GPS हजेरी आणि पेरोलसाठी DPDP कायदा २०२३ अंतर्गत वैयक्तिक डेटा प्रक्रिया करते. तुम्ही तुमचा डेटा पाहू शकता, दुरुस्त करू शकता किंवा ऐच्छिक संमती मागे घेऊ शकता.",
    dpo_name: "गोपाल गावस",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    is_active: true
  });

  // Seed initial ERP consent record + items, DSR request, and grievance ticket
  const consentRec = await db.insert("dpdp_consent_records", {
    tenant_id: "ASCII_GROUP",
    principal_id: "EMP_1001",
    notice_id: "NOT-01",
    notice_version: "v1.0",
    consent_status: "GIVEN",
    ip_address: "103.22.45.10",
    user_agent: "Trail-Delegation ERP Web/1.0",
    consent_signature_hash: "a3f5c71b98de24a1b8c0e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5",
    is_minor: false,
    given_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  });

  await db.insert("dpdp_consent_items", {
    consent_id: consentRec.consent_id,
    purpose_id: "PUR-01",
    is_granted: true
  });
  await db.insert("dpdp_consent_items", {
    consent_id: consentRec.consent_id,
    purpose_id: "PUR-02",
    is_granted: true
  });
  await db.insert("dpdp_consent_items", {
    consent_id: consentRec.consent_id,
    purpose_id: "PUR-03",
    is_granted: true
  });

  await db.insert("dpdp_dsr_requests", {
    request_id: "DSR-9012",
    tenant_id: "ASCII_GROUP",
    principal_id: "EMP_1001",
    request_type: "RIGHT_TO_ACCESS",
    request_status: "SUBMITTED",
    sla_deadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  await db.insert("dpdp_grievance_tickets", {
    ticket_id: "GRV-3310",
    tenant_id: "ASCII_GROUP",
    principal_id: "EMP_1001",
    complaint_summary: "Requesting confirmation of 90-day selfie retention purge in attendance_table.",
    ticket_status: "OPEN",
    sla_deadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  console.log("✅ All 13 Forms & Consent Ledger Seeded Successfully for Trail-Delegation ERP!");
}

if (require.main === module) {
  seed()
    .then(async () => {
      await db.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Seed failed:", err);
      await db.close();
      process.exit(1);
    });
}

module.exports = seed;
