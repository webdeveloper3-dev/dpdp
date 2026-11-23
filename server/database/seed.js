/**
 * ====================================================================
 * MULTI-TENANT ENTERPRISE DPDP SEED DATA (ALL 13 STATUTORY FORMS)
 * ====================================================================
 * Completely seeds all 13 Forms for:
 * 1. ASCII Online Solutions (Master Service Provider)
 * 2. Apex Multi-Speciality Hospitals (Healthcare Client)
 * 3. Bharat Mart E-Commerce (Retail Client)
 * 4. FinShield Digital Bank (FinTech Client)
 */

const db = require("./db");

async function seed() {
  console.log("🌱 Seeding Complete 13-Form Multi-Tenant DPDP Database...");
  db.reset();

  // ==================================================================
  // CLIENT 1: ASCII ONLINE SOLUTIONS (MASTER TENANT)
  // ==================================================================
  await db.insert("dpdp_clients", {
    tenant_id: "ASCII_GROUP",
    client_name: "ASCII Online Solutions",
    entity_name: "ASCII Online Solutions Pvt. Ltd.",
    industry: "Enterprise Software & Cloud Services",
    cin: "U72900MH2020PTC345678",
    pan: "AAACA1234D",
    dpo_name: "Gopal Gawas (Chief Compliance Officer)",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    api_key: "dpdp_live_ascii_master_key_2026",
    status: "ACTIVE",
    created_at: new Date().toISOString()
  });

  // Form 01: Departments
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-01",
    department_name: "Human Resources & Talent Acquisition",
    department_head_name: "Ramesh Sharma",
    department_head_email: "hr@asciionline.com"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-02",
    department_name: "Finance, Taxation & Payroll",
    department_head_name: "Anita Deshmukh",
    department_head_email: "accounts@asciionline.com"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "ASCII_GROUP",
    department_id: "DEP-03",
    department_name: "Cloud Infrastructure & Cybersecurity",
    department_head_name: "Tejas Sawant",
    department_head_email: "infosec@asciionline.com"
  });

  // Form 01: Processes
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-01",
    department_id: "DEP-01",
    process_name: "Candidate Recruitment & Background Verification",
    process_description: "Screening resumes, collecting Aadhaar/PAN for background checks, reference calls",
    risk_level: "HIGH"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-02",
    department_id: "DEP-02",
    process_name: "Monthly Salary Disbursement & PF Tax Compliance",
    process_description: "Direct bank ACH transfers, Provident Fund (PF) deposits, Form 16 TDS generation",
    risk_level: "CRITICAL"
  });
  await db.insert("dpdp_business_processes", {
    tenant_id: "ASCII_GROUP",
    process_id: "PRO-03",
    department_id: "DEP-03",
    process_name: "Identity & Access Management (IAM)",
    process_description: "Single Sign-On (SSO), VPN MFA logs, workstation telemetry monitoring",
    risk_level: "MEDIUM"
  });

  // Form 02: Personal Data Inventory (PII Catalog)
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-01",
    process_id: "PRO-02",
    data_element_name: "Aadhaar Card Number",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-02",
    process_id: "PRO-02",
    data_element_name: "Bank Account & IFSC Number",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-03",
    process_id: "PRO-01",
    data_element_name: "Mobile Phone Number",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "ASCII_GROUP",
    item_id: "CAT-04",
    process_id: "PRO-01",
    data_element_name: "PAN Card Number",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });

  // Form 03: Applications Inventory
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-01",
    app_name: "ASCII HRMS & Attendance Web Portal",
    app_type: "WEB_APP",
    hosting_environment: "AWS Mumbai (ap-south-1)",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-02",
    app_name: "ASCII Employee Mobile App (Flutter)",
    app_type: "MOBILE_APP",
    hosting_environment: "Google Cloud Mumbai",
    data_residency_country: "India",
    is_active: true
  });
  await db.insert("dpdp_applications", {
    tenant_id: "ASCII_GROUP",
    app_id: "APP-03",
    app_name: "Master Financial Ledger PostgreSQL",
    app_type: "DATABASE",
    hosting_environment: "AWS Mumbai (ap-south-1)",
    data_residency_country: "India",
    is_active: true
  });

  // Form 04: Storage Locations Register
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STR-01",
    storage_name: "Production PostgreSQL RDS Cluster",
    storage_type: "SQL_DATABASE",
    geographic_location: "AWS Mumbai (ap-south-1)",
    encryption_at_rest: "AES_256_GCM",
    access_control_mechanism: "RBAC_LEAST_PRIVILEGE"
  });
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STR-02",
    storage_name: "Employee KYC Documents S3 Bucket",
    storage_type: "OBJECT_STORAGE_S3",
    geographic_location: "AWS Mumbai (ap-south-1)",
    encryption_at_rest: "KMS_MANAGED",
    access_control_mechanism: "IAM_ROLE_POLICIES"
  });
  await db.insert("dpdp_storage_locations", {
    tenant_id: "ASCII_GROUP",
    storage_id: "STR-03",
    storage_name: "Physical HR Archive Cupboard (HR-Room-B)",
    storage_type: "FILE_SERVER",
    geographic_location: "ASCII Office Pune (Physical Lock & Key)",
    encryption_at_rest: "NONE",
    access_control_mechanism: "BIOMETRIC_DOOR_ACCESS"
  });

  // Form 05: Collection Points
  await db.insert("dpdp_collection_points", {
    tenant_id: "ASCII_GROUP",
    point_id: "COL-01",
    point_name: "Employee Self-Service Onboarding Portal",
    channel_type: "WEB_PORTAL",
    is_notice_displayed: true,
    is_active: true
  });
  await db.insert("dpdp_collection_points", {
    tenant_id: "ASCII_GROUP",
    point_id: "COL-02",
    point_name: "Careers Job Application Page",
    channel_type: "WEB_PORTAL",
    is_notice_displayed: true,
    is_active: true
  });

  // Form 06: Data Principal Categories
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-01",
    category_name: "Full-Time Employees & Contractors",
    is_minor_category: false,
    special_safeguards_required: false
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-02",
    category_name: "Job Candidates & Applicants",
    is_minor_category: false,
    special_safeguards_required: false
  });
  await db.insert("dpdp_principal_categories", {
    tenant_id: "ASCII_GROUP",
    category_id: "DPR-03",
    category_name: "Minor Dependents of Staff (< 18 Years)",
    is_minor_category: true,
    special_safeguards_required: true
  });

  // Form 07: Purposes
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-01",
    purpose_code: "CORE_SERVICE",
    purpose_description: "Providing employee intranet access, email accounts, and identity authentication",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: true,
    retention_period_months: 36
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-02",
    purpose_code: "PAYROLL_COMPLIANCE",
    purpose_description: "Statutory payroll disbursement, PF, and Form 16 TDS compliance under Indian law",
    lawful_basis: "EMPLOYMENT_SEC_7I",
    is_mandatory: true,
    retention_period_months: 84
  });
  await db.insert("dpdp_purposes", {
    tenant_id: "ASCII_GROUP",
    purpose_id: "PUR-03",
    purpose_code: "OPTIONAL_HEALTH_BENEFITS",
    purpose_description: "Enrollment in optional corporate health insurance, gym, and wellness allowances",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: false,
    retention_period_months: 24
  });

  // Form 08: Retention Rules
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ASCII_GROUP",
    rule_id: "RET-01",
    purpose_id: "PUR-03",
    retention_period_days: 730,
    trigger_event: "CONTRACT_TERMINATION",
    disposal_action: "CRYPTOGRAPHIC_SHREDDING"
  });
  await db.insert("dpdp_retention_rules", {
    tenant_id: "ASCII_GROUP",
    rule_id: "RET-02",
    purpose_id: "PUR-02",
    retention_period_days: 2555,
    trigger_event: "CONTRACT_TERMINATION",
    disposal_action: "HARD_DELETE"
  });

  // Form 09: Access Matrix
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ASCII_GROUP",
    matrix_id: "ACC-01",
    role_name: "HR Recruiter",
    data_element: "Aadhaar / Mobile",
    access_permission: "READ_MASKED",
    justification: "Candidate screening requires identity verification without revealing full numbers"
  });
  await db.insert("dpdp_access_matrix", {
    tenant_id: "ASCII_GROUP",
    matrix_id: "ACC-02",
    role_name: "Payroll Manager",
    data_element: "Bank Details / PAN",
    access_permission: "READ_UNMASKED",
    justification: "Mandatory statutory processing for salary bank ACH batches"
  });

  // Form 10: External Processors (DPAs)
  await db.insert("dpdp_data_processors", {
    tenant_id: "ASCII_GROUP",
    processor_id: "PROC-01",
    processor_name: "Razorpay Software Pvt. Ltd.",
    service_provided: "Salary Payouts & Expense Reimbursements",
    dpa_signed: true,
    data_shared_categories: "Bank Account, IFSC, Beneficiary Name",
    country_hosted: "India"
  });
  await db.insert("dpdp_data_processors", {
    tenant_id: "ASCII_GROUP",
    processor_id: "PROC-02",
    processor_name: "Amazon Web Services India",
    service_provided: "Cloud Infrastructure Hosting & KMS",
    dpa_signed: true,
    data_shared_categories: "Encrypted Application Data at Rest",
    country_hosted: "India"
  });

  // Form 11: Third-Party Personal Data Register (Nominees - Section 14)
  await db.insert("dpdp_third_party_data", {
    tenant_id: "ASCII_GROUP",
    third_party_id: "TPD-01",
    principal_id: "EMP_1001",
    nominee_name: "Sunita Gawas",
    relationship: "Spouse",
    contact_phone: "+91 98200 44332"
  });

  // Form 12: Security Safeguards
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ASCII_GROUP",
    safeguard_id: "SAF-01",
    safeguard_title: "AES-256-GCM Field-Level Encryption at Rest",
    control_type: "ENCRYPTION_AT_REST",
    implementation_status: "DEPLOYED",
    audit_frequency: "ANNUAL"
  });
  await db.insert("dpdp_security_safeguards", {
    tenant_id: "ASCII_GROUP",
    safeguard_id: "SAF-02",
    safeguard_title: "Role-Based Dynamic Masking Middleware",
    control_type: "ACCESS_CONTROL",
    implementation_status: "DEPLOYED",
    audit_frequency: "CONTINUOUS"
  });

  // Form 13: Notices
  await db.insert("dpdp_notices", {
    tenant_id: "ASCII_GROUP",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "en",
    notice_title: "ASCII Online Solutions Privacy Notice (DPDP Act 2023)",
    notice_body_markdown: "ASCII processes personal data for delivering contracted IT services, fulfilling employee payroll obligations, and ensuring system security in compliance with the Digital Personal Data Protection Act 2023. You have the right to access your personal data, request correction or erasure, and designate a legal nominee.",
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
    notice_title: "ASCII ऑनलाइन सॉल्यूशंस गोपनीयता सूचना (DPDP अधिनियम 2023)",
    notice_body_markdown: "ASCII आईटी सेवाएं प्रदान करने, कर्मचारी पेरोल दायित्वों को पूरा करने और DPDP अधिनियम 2023 के तहत सिस्टम सुरक्षा बनाए रखने के लिए व्यक्तिगत डेटा संसाधित करता है। आपको अपने डेटा तक पहुँचने, सुधार या हटाने का अनुरोध करने का अधिकार है।",
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
    notice_title: "ASCII ऑनलाइन सोल्युशन्स गोपनीयता सूचना (DPDP कायदा २०२३)",
    notice_body_markdown: "ASCII करारबद्ध आयटी सेवा देण्यासाठी, कर्मचारी पेरोल पूर्ण करण्यासाठी आणि डिजिटल वैयक्तिक डेटा संरक्षण कायदा २०२३ अंतर्गत प्रणाली सुरक्षित ठेवण्यासाठी डेटा वापरते.",
    dpo_name: "गोपाल गावस",
    dpo_email: "compliance@asciionline.com",
    dpo_phone: "+91 98200 11223",
    is_active: true
  });

  // Seed sample consent receipts, DSR tickets, grievances, and breaches
  await db.insert("dpdp_consent_records", {
    tenant_id: "ASCII_GROUP",
    principal_id: "EMP_1001",
    notice_id: "NOT-01",
    notice_version: "v1.0",
    consent_status: "GIVEN",
    ip_address: "103.22.45.10",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
    consent_signature_hash: "a3f5c71b98de24a1b8c0e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5",
    is_minor: false,
    given_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  });

  await db.insert("dpdp_dsr_requests", {
    request_id: "DSR-9012",
    tenant_id: "ASCII_GROUP",
    principal_id: "USER_GUEST_99",
    request_type: "RIGHT_TO_ERASURE",
    request_status: "SUBMITTED",
    sla_deadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  await db.insert("dpdp_grievance_tickets", {
    ticket_id: "GRV-3310",
    tenant_id: "ASCII_GROUP",
    principal_id: "EMP_1001",
    complaint_summary: "Requesting confirmation that marketing email notifications have ceased following my opt-out.",
    ticket_status: "OPEN",
    sla_deadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  });

  // ==================================================================
  // CLIENT 2: APEX MULTI-SPECIALITY HOSPITALS
  // ==================================================================
  await db.insert("dpdp_clients", {
    tenant_id: "APEX_HEALTHCARE",
    client_name: "Apex Multi-Speciality Hospitals",
    entity_name: "Apex Healthcare & Research Institute Ltd.",
    industry: "Healthcare & Pharmaceuticals",
    cin: "U85110MH2018PLC301122",
    pan: "AAACA5678K",
    dpo_name: "Dr. Sunita Kulkarni (Medical Legal DPO)",
    dpo_email: "dpo@apexhospital.org",
    dpo_phone: "+91 98222 44556",
    api_key: "dpdp_live_apex_health_key_2026",
    status: "ACTIVE",
    created_at: new Date().toISOString()
  });

  await db.insert("dpdp_departments", {
    tenant_id: "APEX_HEALTHCARE",
    department_id: "DEP-01",
    department_name: "Outpatient Department (OPD) & Admissions",
    department_head_name: "Dr. Vikram Joshi",
    department_head_email: "opd@apexhospital.org"
  });
  await db.insert("dpdp_departments", {
    tenant_id: "APEX_HEALTHCARE",
    department_id: "DEP-02",
    department_name: "Pathology, Diagnostics & Imaging",
    department_head_name: "Dr. Meena Iyer",
    department_head_email: "lab@apexhospital.org"
  });

  await db.insert("dpdp_business_processes", {
    tenant_id: "APEX_HEALTHCARE",
    process_id: "PRO-01",
    department_id: "DEP-01",
    process_name: "Patient Intake, EMR & Medical History",
    process_description: "Recording symptoms, historical diagnosis, surgical records, blood group",
    risk_level: "CRITICAL"
  });

  await db.insert("dpdp_data_catalog", {
    tenant_id: "APEX_HEALTHCARE",
    item_id: "CAT-01",
    process_id: "PRO-01",
    data_element_name: "Diagnostic Blood Test Reports",
    classification_level: "CRITICAL",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: false
  });
  await db.insert("dpdp_data_catalog", {
    tenant_id: "APEX_HEALTHCARE",
    item_id: "CAT-02",
    process_id: "PRO-01",
    data_element_name: "Patient Mobile & WhatsApp Alert Number",
    classification_level: "HIGH",
    storage_format: "ENCRYPTED_TEXT",
    has_blind_index: true
  });

  await db.insert("dpdp_purposes", {
    tenant_id: "APEX_HEALTHCARE",
    purpose_id: "PUR-01",
    purpose_code: "MEDICAL_TREATMENT",
    purpose_description: "Providing diagnosis, clinical care, lab tests, and doctor consultations",
    lawful_basis: "CERTAIN_LEGITIMATE_USES_SEC_7",
    is_mandatory: true,
    retention_period_months: 120
  });

  await db.insert("dpdp_notices", {
    tenant_id: "APEX_HEALTHCARE",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "en",
    notice_title: "Apex Hospital Patient Privacy Notice (DPDP Act 2023)",
    notice_body_markdown: "Apex Hospitals processes medical records strictly for patient care and legal healthcare mandates under the DPDP Act 2023. You have the right to access your medical records and designate a legal healthcare nominee.",
    dpo_name: "Dr. Sunita Kulkarni",
    dpo_email: "dpo@apexhospital.org",
    dpo_phone: "+91 98222 44556",
    is_active: true
  });

  // ==================================================================
  // CLIENT 3: BHARAT MART (RETAIL / E-COMMERCE)
  // ==================================================================
  await db.insert("dpdp_clients", {
    tenant_id: "BHARAT_RETAIL",
    client_name: "Bharat Mart Retail",
    entity_name: "Bharat Mart E-Commerce India Ltd.",
    industry: "Retail & Consumer Goods",
    cin: "U52100MH2019PLC298765",
    pan: "BBBCB4321E",
    dpo_name: "Adv. Rahul Verma",
    dpo_email: "privacy@bharatmart.in",
    dpo_phone: "+91 98111 88990",
    api_key: "dpdp_live_bharat_mart_key_2026",
    status: "ACTIVE",
    created_at: new Date().toISOString()
  });

  await db.insert("dpdp_departments", {
    tenant_id: "BHARAT_RETAIL",
    department_id: "DEP-01",
    department_name: "Logistics, Delivery & Fulfillment",
    department_head_name: "Kunal Bansal",
    department_head_email: "logistics@bharatmart.in"
  });

  await db.insert("dpdp_purposes", {
    tenant_id: "BHARAT_RETAIL",
    purpose_id: "PUR-01",
    purpose_code: "ORDER_FULFILLMENT",
    purpose_description: "Processing payments, delivering orders to shipping addresses, and SMS tracking",
    lawful_basis: "EXPLICIT_CONSENT",
    is_mandatory: true,
    retention_period_months: 60
  });

  await db.insert("dpdp_notices", {
    tenant_id: "BHARAT_RETAIL",
    notice_id: "NOT-01",
    version_tag: "v1.0",
    language_code: "en",
    notice_title: "Bharat Mart Customer Privacy Notice",
    notice_body_markdown: "We respect your privacy under the Indian DPDP Act 2023. We collect delivery addresses and payment details only to fulfill your orders. You can withdraw marketing consent at any time.",
    dpo_name: "Adv. Rahul Verma",
    dpo_email: "privacy@bharatmart.in",
    dpo_phone: "+91 98111 88990",
    is_active: true
  });

  console.log("✅ All 13 Forms Seeded Successfully for all Enterprise Clients!");
}

if (require.main === module) {
  seed();
}

module.exports = seed;
