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

  // Form 01 Part A: Legal Entity / Organisation Profile
  await db.insert("dpdp_entities", {
    tenant_id: "ASCII_GROUP",
    entity_id: "ENT-01",
    entity_name: "ASCII Online Solutions Pvt. Ltd.",
    entity_type: "Company",
    registered_address: "Pune & Mumbai Operations Hub, Maharashtra, India",
    head_name: "Gopal Gawas",
    head_designation: "Chief Compliance Officer & Director",
    handles_minors_under_18: "Yes",
    privacy_contact_person: "Gopal Gawas (compliance@asciionline.com)",
    outsourced_agencies: "Google Firebase (FCM Push), SMTP Relay, Cloud Hosting"
  });

  // Operating Companies / Units under Entity
  await db.insert("dpdp_companies", {
    tenant_id: "ASCII_GROUP",
    company_id: "CMP-01",
    entity_id: "ENT-01",
    company_name: "ASCII Trail-Delegation ERP — Head Office",
    cin: "U72900MH2020PTC345678",
    pan: "AAACA1234D",
    branch_locations: "Pune HQ, Mumbai Branch",
    staff_permanent: 85,
    staff_contract: 20,
    staff_outsourced: 10
  });
  await db.insert("dpdp_companies", {
    tenant_id: "ASCII_GROUP",
    company_id: "CMP-02",
    entity_id: "ENT-01",
    company_name: "ASCII ERP Client Support & Field Unit",
    cin: "U72900MH2020PTC345678",
    pan: "AAACA1234D",
    branch_locations: "Mumbai Regional Desk",
    staff_permanent: 25,
    staff_contract: 12,
    staff_outsourced: 5
  });

  // Form 01 Part B: Departments (Linked to Entity & Company)
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-01",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Core HR, PIM & Employee Onboarding",
    department_head_name: "Ramesh Sharma",
    department_head_email: "hr@asciionline.com",
    staff_count: 14,
    locations: "Pune HQ",
    handles_personal_data: "Yes",
    uses_external_vendors: "Background Verification Agency"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-02",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Payroll, Accounts & Statutory Filings",
    department_head_name: "Anita Deshmukh",
    department_head_email: "accounts@asciionline.com",
    staff_count: 10,
    locations: "Pune HQ",
    handles_personal_data: "Yes",
    uses_external_vendors: "Banking ACH / PF Portal"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-03",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_name: "Attendance, Leave & Field Operations",
    department_head_name: "Vikram Kulkarni",
    department_head_email: "ops@asciionline.com",
    staff_count: 30,
    locations: "Pune HQ & Mumbai Branch",
    handles_personal_data: "Yes",
    uses_external_vendors: "None"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-04",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Task Delegation, Activity Tracker & IT Security",
    department_head_name: "Tejas Sawant",
    department_head_email: "infosec@asciionline.com",
    staff_count: 22,
    locations: "Pune HQ",
    handles_personal_data: "Yes",
    uses_external_vendors: "Google Firebase FCM, SMTP Email Relay"
  });

  // Form 01 Part C: Functions (Mapped to Entity, Company & Departments)
  await db.insert("dpdp_functions", {
    tenant_id: "ASCII_GROUP",
    function_id: "FN-001",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-01",
    function_name: "Human resources, recruitment and joining formalities",
    exists_flag: true,
    remarks: "Handles PIM onboarding, KYC & dependent info"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ASCII_GROUP",
    function_id: "FN-002",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-02",
    function_name: "Payroll, provident fund, insurance and statutory compliance",
    exists_flag: true,
    remarks: "Salary runs, PF/ESIC & Form 16 TDS"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ASCII_GROUP",
    function_id: "FN-003",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_id: "DEP-03",
    function_name: "Attendance, leave management and field operations",
    exists_flag: true,
    remarks: "Biometric punch selfie, GPS attendance & sick leave medicals"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ASCII_GROUP",
    function_id: "FN-004",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-04",
    function_name: "IT, systems, website, email and network administration",
    exists_flag: true,
    remarks: "ERP auth_table RBAC, task delegation & activity logging"
  });

  // Form 01 Part D: Business Processes (Linked to Entity, Company, DEP & FN)
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-01",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-01",
    function_id: "FN-001",
    process_name: "Employee Onboarding, KYC & PIM Profile (personal_table, contact_table)",
    process_description: "Collecting employee identity, contact, address, education, work experience, emergency contacts & dependents",
    frequency: "Daily",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-02",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-02",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-02",
    function_id: "FN-002",
    process_name: "Monthly Payroll Runs, Payslips & PF/ESIC (accounts_table, payroll_runs)",
    process_description: "Salary structure calculation, bank ACH payouts, Aadhaar/PAN verification, PF & Form 16 TDS compliance",
    frequency: "Monthly",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-01",
    risk_level: "CRITICAL"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-03",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_id: "DEP-03",
    function_id: "FN-003",
    process_name: "Biometric Selfie, GPS Attendance & Medical Leaves (attendance_table, leaves_2025)",
    process_description: "Geofenced punch-in lat/long, selfie verification, sick leave medical certificates in Medicals/",
    frequency: "Daily",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-01, DEP-02",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-04",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-04",
    function_id: "FN-004",
    process_name: "Task Delegation, Daily Reports & Multi-Tenant Auth (auth_table, erp_activity_log)",
    process_description: "JWT authentication, role allocation, task delegation notifications, daily report submissions & audit logs",
    frequency: "Daily",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-01, DEP-03",
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

  // ==================================================================
  // CLIENT 2: ST. PETER SCHOOL (COMPLETE SIMPLE SCHOOL EXAMPLE)
  // ==================================================================
  await db.insert("dpdp_clients", {
    tenant_id: "ST_PETER_SCHOOL",
    client_name: "St. Peter School",
    entity_name: "St. Peter Educational Trust",
    industry: "School & Education",
    cin: "TRUST-MH-2008-4512",
    pan: "AABTS4512K",
    dpo_name: "Fr. Thomas D'Souza (Principal & DPO)",
    dpo_email: "privacy@stpeterschool.edu.in",
    dpo_phone: "+91 98210 55443",
    api_key: "dpdp_live_st_peter_school_2026",
    status: "ACTIVE",
    created_at: new Date().toISOString()
  });

  // Form 01 Part A: Entity
  await db.insert("dpdp_entities", {
    tenant_id: "ST_PETER_SCHOOL",
    entity_id: "ENT-01",
    entity_name: "St. Peter Educational Trust",
    entity_type: "Trust",
    registered_address: "St. Peter Road, Bandra West, Mumbai, Maharashtra",
    head_name: "Fr. Thomas D'Souza",
    head_designation: "Principal & Managing Trustee",
    handles_minors_under_18: "Yes",
    privacy_contact_person: "Fr. Thomas D'Souza (privacy@stpeterschool.edu.in)",
    outsourced_agencies: "School Bus Transport Contractor, Razorpay Fee Gateway"
  });

  // Form 01: Companies / Campuses
  await db.insert("dpdp_companies", {
    tenant_id: "ST_PETER_SCHOOL",
    company_id: "CMP-01",
    entity_id: "ENT-01",
    company_name: "St. Peter Primary & High School (Main Campus)",
    cin: "UDISE-272301001",
    pan: "AABTS4512K",
    branch_locations: "Main Campus, Bandra West",
    staff_permanent: 65,
    staff_contract: 12,
    staff_outsourced: 8
  });
  await db.insert("dpdp_companies", {
    tenant_id: "ST_PETER_SCHOOL",
    company_id: "CMP-02",
    entity_id: "ENT-01",
    company_name: "St. Peter Junior College & Transport Wing",
    cin: "UDISE-272301002",
    pan: "AABTS4512K",
    branch_locations: "Annex Building & Bus Yard",
    staff_permanent: 22,
    staff_contract: 6,
    staff_outsourced: 14
  });

  // Form 01 Part B: Departments (Company-wise separated)
  await db.insert("dpdp_departments", {
    tenant_id: "ST_PETER_SCHOOL",
    department_id: "DEP-01",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Admissions & Student Office",
    department_head_name: "Mrs. Sunita Nair",
    department_head_email: "admissions@stpeterschool.edu.in",
    staff_count: 5,
    locations: "Main Campus Ground Floor",
    handles_personal_data: "Yes",
    uses_external_vendors: "Online Admission Portal"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ST_PETER_SCHOOL",
    department_id: "DEP-02",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Accounts & Fee Office",
    department_head_name: "Mr. Rajesh Kulkarni",
    department_head_email: "fees@stpeterschool.edu.in",
    staff_count: 4,
    locations: "Main Campus Admin Block",
    handles_personal_data: "Yes",
    uses_external_vendors: "Razorpay Fee Gateway"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ST_PETER_SCHOOL",
    department_id: "DEP-03",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_name: "Health Room & Attendance",
    department_head_name: "Nurse Maria Gomes",
    department_head_email: "health@stpeterschool.edu.in",
    staff_count: 3,
    locations: "Main Campus Infirmary",
    handles_personal_data: "Yes",
    uses_external_vendors: "None"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ST_PETER_SCHOOL",
    department_id: "DEP-04",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_name: "School Bus & Transport",
    department_head_name: "Mr. Suresh Patil",
    department_head_email: "transport@stpeterschool.edu.in",
    staff_count: 14,
    locations: "Bus Yard",
    handles_personal_data: "Yes",
    uses_external_vendors: "SafeBus GPS Tracking"
  });

  // Form 01 Part C: Functions
  await db.insert("dpdp_functions", {
    tenant_id: "ST_PETER_SCHOOL",
    function_id: "FN-001",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-01",
    function_name: "Student Admissions & Records",
    exists_flag: true,
    remarks: "Handles admission forms, birth certificates & student IDs"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ST_PETER_SCHOOL",
    function_id: "FN-002",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-02",
    function_name: "Fee Collection & Receipts",
    exists_flag: true,
    remarks: "Term fees, online payments & scholarship concessions"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ST_PETER_SCHOOL",
    function_id: "FN-003",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-03",
    function_name: "Daily Attendance & Medical Care",
    exists_flag: true,
    remarks: "Class attendance, blood group & allergy records"
  });
  await db.insert("dpdp_functions", {
    tenant_id: "ST_PETER_SCHOOL",
    function_id: "FN-004",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_id: "DEP-04",
    function_name: "Bus Route & Student Pickup Safety",
    exists_flag: true,
    remarks: "Bus stops, parent pickup alerts & authorized pickup persons"
  });

  // Form 01 Part D: Processes
  await db.insert("dpdp_business_processes", {
    tenant_id: "ST_PETER_SCHOOL",
    process_id: "PRO-01",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-01",
    function_id: "FN-001",
    process_name: "New Student Admission Form",
    process_description: "Collecting student name, DOB, Aadhaar/birth certificate, parent phone & home address",
    frequency: "Yearly / event-based",
    format: "Both",
    involves_personal_data: "Yes",
    other_departments: "DEP-02",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ST_PETER_SCHOOL",
    process_id: "PRO-02",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-02",
    function_id: "FN-002",
    process_name: "Term Fee & Receipt Processing",
    process_description: "Generating fee challans, online payment links and parent fee receipts",
    frequency: "Monthly",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-01",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ST_PETER_SCHOOL",
    process_id: "PRO-03",
    entity_id: "ENT-01",
    company_id: "CMP-01",
    department_id: "DEP-03",
    function_id: "FN-003",
    process_name: "Student Attendance & Sick Room Log",
    process_description: "Marking daily attendance and recording allergies, blood group & nurse visits",
    frequency: "Daily",
    format: "Both",
    involves_personal_data: "Yes",
    other_departments: "DEP-01",
    risk_level: "CRITICAL"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ST_PETER_SCHOOL",
    process_id: "PRO-04",
    entity_id: "ENT-01",
    company_id: "CMP-02",
    department_id: "DEP-04",
    function_id: "FN-004",
    process_name: "School Bus Pickup & Parent Alert",
    process_description: "Tracking bus stop pickup/drop and verifying authorized pickup guardian",
    frequency: "Daily",
    format: "Digital",
    involves_personal_data: "Yes",
    other_departments: "DEP-01",
    risk_level: "HIGH"
  });

  // Form 02: PII Catalog
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ST_PETER_SCHOOL",
    item_id: "CAT-01",
    process_id: "PRO-01",
    data_element_name: "Student Full Name & Date of Birth",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ST_PETER_SCHOOL",
    item_id: "CAT-02",
    process_id: "PRO-01",
    data_element_name: "Student Aadhaar & Birth Certificate",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ST_PETER_SCHOOL",
    item_id: "CAT-03",
    process_id: "PRO-01",
    data_element_name: "Parent Mobile Number & Home Address",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ST_PETER_SCHOOL",
    item_id: "CAT-04",
    process_id: "PRO-03",
    data_element_name: "Student Medical Allergies & Blood Group",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ST_PETER_SCHOOL",
    item_id: "CAT-05",
    process_id: "PRO-04",
    data_element_name: "School Bus GPS & Pickup Photo",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });

  // Form 03: Applications
  await db.insert("dpdp_applications", {
    tenant_id: "ST_PETER_SCHOOL",
    app_id: "APP-01",
    app_name: "St. Peter School ERP Portal",
    app_type: "WEB_APP",
    hosting_environment: "Cloud India (Mumbai)",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ST_PETER_SCHOOL",
    app_id: "APP-02",
    app_name: "St. Peter Parent Mobile App",
    app_type: "MOBILE_APP",
    hosting_environment: "Android / iOS + Cloud India",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ST_PETER_SCHOOL",
    app_id: "APP-03",
    app_name: "Tally Fee Accounting",
    app_type: "DATABASE",
    hosting_environment: "School Admin Office PC",
    data_residency_country: "India",
    is_active: true
  });

  // Form 04: Storage
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ST_PETER_SCHOOL",
    storage_id: "STO-01",
    storage_name: "School ERP Cloud Database (Mumbai)",
    storage_type: "SQL_DATABASE",
    geographic_location: "India (Mumbai)",
    encryption_at_rest: "AES_256_GCM",
    access_control_mechanism: "ROLE_BASED_PASSWORD"
  });
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ST_PETER_SCHOOL",
    storage_id: "STO-02",
    storage_name: "Locked Admission Record Cupboard (Office Room 1)",
    storage_type: "FILE_SERVER",
    geographic_location: "Main Campus Office",
    encryption_at_rest: "PHYSICAL_LOCK",
    access_control_mechanism: "OFFICE_KEY_REGISTER"
  });

  // Form 05: Collection Points
  await db.insert("dpdp_collection_points", {
    tenant_id: "ST_PETER_SCHOOL",
    point_id: "COL-01",
    point_name: "School Office Paper Admission Form",
    channel_type: "PAPER_FORM",
    is_notice_displayed: true,
    is_active: true
  });
  await db.insert("dpdp_collection_points", {
    tenant_id: "ST_PETER_SCHOOL",
    point_id: "COL-02",
    point_name: "Online Parent Admission & Fee Portal",
    channel_type: "WEB_PORTAL",
    is_notice_displayed: true,
    is_active: true
  });

  // Form 06: Data Principal Categories
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ST_PETER_SCHOOL",
    category_id: "DPR-01",
    category_name: "Students (Under 18 Years — Sec 9 Minor)",
    is_minor_category: true,
    special_safeguards_required: true
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ST_PETER_SCHOOL",
    category_id: "DPR-02",
    category_name: "Parents & Legal Guardians",
    is_minor_category: false,
    special_safeguards_required: false
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ST_PETER_SCHOOL",
    category_id: "DPR-03",
    category_name: "Teachers & School Staff",
    is_minor_category: false,
    special_safeguards_required: false
  });

  // Form 07: Purposes
  await db.insert("dpdp_purposes", {
    tenant_id: "ST_PETER_SCHOOL",
    purpose_id: "PUR-01",
    purpose_code: "SCHOOL_ADMISSION_EDUCATION",
    purpose_description: "Student admission, attendance, exam report cards and parent communication",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: true,
    retention_period_months: 60
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ST_PETER_SCHOOL",
    purpose_id: "PUR-02",
    purpose_code: "FEE_BILLING_ACCOUNTS",
    purpose_description: "School fee collection, receipts and statutory education board records",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: true,
    retention_period_months: 84
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ST_PETER_SCHOOL",
    purpose_id: "PUR-03",
    purpose_code: "BUS_GPS_AND_EVENT_PHOTOS",
    purpose_description: "School bus live GPS alerts and annual day / sports event photographs",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: false,
    retention_period_months: 12
  });

  // Form 08: Retention Rules
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ST_PETER_SCHOOL",
    rule_id: "RET-01",
    purpose_id: "PUR-03",
    retention_period_days: 365,
    trigger_event: "ACADEMIC_YEAR_END",
    disposal_action: "HARD_DELETE"
  });
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ST_PETER_SCHOOL",
    rule_id: "RET-02",
    purpose_id: "PUR-01",
    retention_period_days: 1825,
    trigger_event: "STUDENT_LEAVING",
    disposal_action: "ANONYMIZE_AND_ARCHIVE"
  });

  // Form 09: Access Matrix
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ST_PETER_SCHOOL",
    matrix_id: "ACC-01",
    role_name: "Class Teacher",
    data_element: "Student Name, Attendance & Parent Mobile",
    access_permission: "READ_MASKED",
    justification: "Daily classroom attendance & parent call without exporting full student IDs"
  });
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ST_PETER_SCHOOL",
    matrix_id: "ACC-02",
    role_name: "Principal & Office Admin",
    data_element: "Admission Files, Aadhaar & Medical Records",
    access_permission: "READ_UNMASKED",
    justification: "Official school board verification & student medical safety"
  });

  // Form 10: External Processors
  await db.insert("dpdp_data_processors", {
    tenant_id: "ST_PETER_SCHOOL",
    processor_id: "PROC-01",
    processor_name: "Razorpay Fee Payment Gateway",
    service_provided: "Online School Fee Payments",
    dpa_signed: true,
    data_shared_categories: "Parent Name, Email, Mobile, Fee Amount",
    country_hosted: "India"
  });
  await db.insert("dpdp_data_processors", {
    tenant_id: "ST_PETER_SCHOOL",
    processor_id: "PROC-02",
    processor_name: "SafeBus GPS Tracking Vendor",
    service_provided: "School Bus Location & Pickup SMS Alerts",
    dpa_signed: true,
    data_shared_categories: "Student Name, Bus Route, Parent Mobile",
    country_hosted: "India"
  });

  // Form 11: Third-Party Personal Data (Authorized Pickup Guardian)
  await db.insert("dpdp_third_party_data", {
    tenant_id: "ST_PETER_SCHOOL",
    third_party_id: "TPD-01",
    principal_id: "STU_101",
    nominee_name: "Mrs. Meera Fernandes",
    relationship: "Grandmother (Authorized School Pickup)",
    contact_phone: "+91 98211 33221"
  });

  // Form 12: Security Safeguards
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ST_PETER_SCHOOL",
    safeguard_id: "SAF-01",
    safeguard_title: "Locked Admission Cupboard & Office Key Register",
    control_type: "PHYSICAL_SECURITY",
    implementation_status: "DEPLOYED",
    audit_frequency: "QUARTERLY"
  });
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ST_PETER_SCHOOL",
    safeguard_id: "SAF-02",
    safeguard_title: "Parent Consent Verification & Encrypted Student DB",
    control_type: "ENCRYPTION_AT_REST",
    implementation_status: "DEPLOYED",
    audit_frequency: "CONTINUOUS"
  });

  // Form 13: Multilingual Notices (Parent / Guardian Consent)
  await db.insert("dpdp_notices", {
    tenant_id: "ST_PETER_SCHOOL",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "en",
    notice_title: "St. Peter School Parent & Student Privacy Notice (DPDP Act 2023)",
    notice_body_markdown: "St. Peter School collects student admission details, parent contact info, medical allergies, and attendance strictly for education, student safety, and fee administration. Because students are under 18, verifiable parent/guardian consent is required under Section 9, and optional bus GPS / event photo permissions may be withdrawn anytime.",
    dpo_name: "Fr. Thomas D'Souza",
    dpo_email: "privacy@stpeterschool.edu.in",
    dpo_phone: "+91 98210 55443",
    is_active: true
  });
  await db.insert("dpdp_notices", {
    tenant_id: "ST_PETER_SCHOOL",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "hi",
    notice_title: "सेंट पीटर स्कूल अभिभावक एवं छात्र गोपनीयता सूचना (DPDP अधिनियम 2023)",
    notice_body_markdown: "सेंट पीटर स्कूल शिक्षा, छात्र सुरक्षा और शुल्क प्रबंधन के लिए छात्र प्रवेश विवरण, माता-पिता का संपर्क और चिकित्सा जानकारी एकत्र करता है। 18 वर्ष से कम आयु के छात्रों के लिए माता-पिता की सहमति आवश्यक है।",
    dpo_name: "फादर थॉमस डिसूजा",
    dpo_email: "privacy@stpeterschool.edu.in",
    dpo_phone: "+91 98210 55443",
    is_active: true
  });
  await db.insert("dpdp_notices", {
    tenant_id: "ST_PETER_SCHOOL",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "mr",
    notice_title: "सेंट पीटर स्कूल पालक व विद्यार्थी गोपनीयता सूचना (DPDP कायदा २०२३)",
    notice_body_markdown: "सेंट पीटर स्कूल शिक्षण, विद्यार्थी सुरक्षा आणि शुल्क व्यवस्थापनासाठी प्रवेश तपशील, पालक संपर्क आणि वैद्यकीय माहिती गोळा करते. १८ वर्षांखालील विद्यार्थ्यांसाठी पालकांची संमती आवश्यक आहे.",
    dpo_name: "फादर थॉमस डिसोझा",
    dpo_email: "privacy@stpeterschool.edu.in",
    dpo_phone: "+91 98210 55443",
    is_active: true
  });

  // Sample Minor Consent (Parent Verified - Sec 9), DSR & Grievance for St. Peter School
  const schoolConsent = await db.insert("dpdp_consent_records", {
    tenant_id: "ST_PETER_SCHOOL",
    principal_id: "STU_101",
    notice_id: "NOT-01",
    notice_version: "v1.0",
    consent_status: "GIVEN",
    ip_address: "103.22.45.20",
    user_agent: "St. Peter Parent Portal/1.0",
    consent_signature_hash: "b4e6d82a09ef35b2c9d1f3a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
    is_minor: true,
    guardian_principal_id: "PARENT_101",
    given_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  });

  await db.insert("dpdp_consent_items", { consent_id: schoolConsent.consent_id, purpose_id: "PUR-01", is_granted: true });
  await db.insert("dpdp_consent_items", { consent_id: schoolConsent.consent_id, purpose_id: "PUR-02", is_granted: true });
  await db.insert("dpdp_consent_items", { consent_id: schoolConsent.consent_id, purpose_id: "PUR-03", is_granted: true });

  await db.insert("dpdp_dsr_requests", {
    request_id: "DSR-201",
    tenant_id: "ST_PETER_SCHOOL",
    principal_id: "STU_101",
    request_type: "RIGHT_TO_CORRECTION",
    request_status: "SUBMITTED",
    sla_deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  await db.insert("dpdp_grievance_tickets", {
    ticket_id: "GRV-201",
    tenant_id: "ST_PETER_SCHOOL",
    principal_id: "PARENT_101",
    complaint_summary: "Parent requested removal of student photo from school event gallery.",
    ticket_status: "OPEN",
    sla_deadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  console.log("✅ All 13 Forms & Consent Ledger Seeded Successfully for Trail-Delegation ERP & St. Peter School!");
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
