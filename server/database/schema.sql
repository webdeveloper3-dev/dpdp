-- ====================================================================================================
-- ENTERPRISE GENERALIZED DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023
-- MASTER RELATIONAL DATABASE SCHEMA (MULTI-TENANT RoPA COMPLIANCE TABLES)
-- ====================================================================================================
-- Master Service Provider : ASCII Online Solutions Pvt. Ltd.
-- Architecture Pattern    : Multi-Tenant Enterprise Privacy-as-a-Service (DPDP SaaS)
-- Legal Grounding         : Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, India)
-- Mapping                 : Statutory Audit Forms 01 to 13 (Record of Processing Activities - RoPA)
-- ====================================================================================================

-- ----------------------------------------------------------------------------------------------------
-- TABLE 0: MULTI-TENANT ENTERPRISE CLIENTS (ASCII MASTER CLIENT REGISTER)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_clients (
    tenant_id VARCHAR(64) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    cin VARCHAR(50),
    pan VARCHAR(20),
    dpo_name VARCHAR(150) NOT NULL,
    dpo_email VARCHAR(255) NOT NULL,
    dpo_phone VARCHAR(50),
    api_key VARCHAR(128) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 0B: ENTITIES / ORGANISATION PROFILES (Form 01, Part A)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_entities (
    tenant_id VARCHAR(64) NOT NULL,
    entity_id VARCHAR(32) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(60) DEFAULT 'Company',
    registered_address TEXT,
    head_name VARCHAR(150),
    head_designation VARCHAR(150),
    handles_minors_under_18 VARCHAR(20) DEFAULT 'No',
    privacy_contact_person VARCHAR(255),
    outsourced_agencies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, entity_id),
    FOREIGN KEY (tenant_id) REFERENCES dpdp_clients(tenant_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 0C: OPERATING COMPANIES / BRANCHES / UNITS (Under Entity)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_companies (
    tenant_id VARCHAR(64) NOT NULL,
    company_id VARCHAR(32) NOT NULL,
    entity_id VARCHAR(32) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    cin VARCHAR(50),
    pan VARCHAR(20),
    branch_locations TEXT,
    staff_permanent INT DEFAULT 0,
    staff_contract INT DEFAULT 0,
    staff_outsourced INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, company_id),
    FOREIGN KEY (tenant_id) REFERENCES dpdp_clients(tenant_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 1: DEPARTMENTS & FUNCTIONAL DIVISIONS (Form 01, Part B)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_departments (
    tenant_id VARCHAR(64) NOT NULL,
    department_id VARCHAR(32) NOT NULL,
    entity_id VARCHAR(32),
    company_id VARCHAR(32),
    department_name VARCHAR(255) NOT NULL,
    department_head_name VARCHAR(150),
    department_head_email VARCHAR(255),
    staff_count INT,
    locations VARCHAR(255),
    handles_personal_data VARCHAR(20) DEFAULT 'Yes',
    uses_external_vendors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, department_id),
    FOREIGN KEY (tenant_id) REFERENCES dpdp_clients(tenant_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 1C: ORGANISATIONAL FUNCTIONS CHECKLIST (Form 01, Part C)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_functions (
    tenant_id VARCHAR(64) NOT NULL,
    function_id VARCHAR(32) NOT NULL,
    entity_id VARCHAR(32),
    company_id VARCHAR(32),
    department_id VARCHAR(32) NOT NULL,
    function_name VARCHAR(255) NOT NULL,
    exists_flag BOOLEAN DEFAULT TRUE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, function_id),
    FOREIGN KEY (tenant_id) REFERENCES dpdp_clients(tenant_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 2: BUSINESS PROCESSES & WORKFLOWS (Form 01, Part D)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_business_processes (
    tenant_id VARCHAR(64) NOT NULL,
    process_id VARCHAR(32) NOT NULL,
    entity_id VARCHAR(32),
    company_id VARCHAR(32),
    department_id VARCHAR(32) NOT NULL,
    function_id VARCHAR(32),
    process_name VARCHAR(255) NOT NULL,
    process_description TEXT,
    frequency VARCHAR(50) DEFAULT 'Daily',
    format VARCHAR(30) DEFAULT 'Digital',
    involves_personal_data VARCHAR(20) DEFAULT 'Yes',
    other_departments VARCHAR(255),
    risk_level VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, process_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 3: APPLICATIONS, SOFTWARE & SYSTEMS REGISTER (Form 03)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_applications (
    tenant_id VARCHAR(64) NOT NULL,
    app_id VARCHAR(32) NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    app_type VARCHAR(50) NOT NULL, -- WEB_APP, MOBILE_APP, DATABASE, SPREADSHEET, THIRD_PARTY_SAAS
    hosting_environment VARCHAR(100), -- AWS, AZURE, GCP, ON_PREMISE
    data_residency_country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, app_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 4: DATA STORAGE LOCATIONS & CLOUD HOSTS (Form 04)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_storage_locations (
    tenant_id VARCHAR(64) NOT NULL,
    storage_id VARCHAR(32) NOT NULL,
    storage_name VARCHAR(255) NOT NULL,
    storage_type VARCHAR(50) NOT NULL, -- SQL_DATABASE, NOSQL, OBJECT_STORAGE_S3, FILE_SERVER
    geographic_location VARCHAR(100) DEFAULT 'India (ap-south-1)',
    encryption_at_rest VARCHAR(50) DEFAULT 'AES_256_GCM',
    access_control_mechanism VARCHAR(100) DEFAULT 'RBAC_LEAST_PRIVILEGE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, storage_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 5: COLLECTION POINTS & INTAKE CHANNELS (Form 05)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_collection_points (
    tenant_id VARCHAR(64) NOT NULL,
    point_id VARCHAR(32) NOT NULL,
    point_name VARCHAR(255) NOT NULL,
    channel_type VARCHAR(50) NOT NULL, -- WEB_PORTAL, MOBILE_APP, REST_API, PHYSICAL_PAPER_FORM
    is_notice_displayed BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, point_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 6: DATA PRINCIPAL CATEGORIES (Form 06)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_principal_categories (
    tenant_id VARCHAR(64) NOT NULL,
    category_id VARCHAR(32) NOT NULL,
    category_name VARCHAR(150) NOT NULL, -- EMPLOYEE, CUSTOMER, VENDOR, MINOR_UNDER_18, PERSON_WITH_DISABILITY
    is_minor_category BOOLEAN DEFAULT FALSE,
    special_safeguards_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, category_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 7: PERSONAL DATA CATALOG & SENSITIVITY CLASSIFICATION (Form 02)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_data_catalog (
    tenant_id VARCHAR(64) NOT NULL,
    item_id VARCHAR(32) NOT NULL,
    process_id VARCHAR(32) NOT NULL,
    data_element_name VARCHAR(150) NOT NULL, -- Aadhaar, PAN, Mobile, Blood Group, Salary
    classification_level VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    storage_format VARCHAR(30) NOT NULL DEFAULT 'ENCRYPTED_TEXT',
    has_blind_index BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, item_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 8: PURPOSES OF PROCESSING & LAWFUL BASES (Form 07)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_purposes (
    tenant_id VARCHAR(64) NOT NULL,
    purpose_id VARCHAR(32) NOT NULL,
    purpose_code VARCHAR(100) NOT NULL, -- CORE_SERVICE, PAYROLL_PROCESSING, MARKETING_PROMO
    purpose_description TEXT NOT NULL,
    lawful_basis VARCHAR(50) NOT NULL, -- EXPLICIT_CONSENT, CERTAIN_LEGITIMATE_USES_SEC_7, EMPLOYMENT_SEC_7I
    is_mandatory BOOLEAN DEFAULT FALSE,
    retention_period_months INT NOT NULL DEFAULT 36,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, purpose_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 9: ROLES & RBAC ACCESS MATRIX (Form 09)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_access_matrix (
    tenant_id VARCHAR(64) NOT NULL,
    matrix_id VARCHAR(32) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    data_element VARCHAR(100) NOT NULL,
    access_permission VARCHAR(50) NOT NULL, -- READ_MASKED, READ_UNMASKED, WRITE, FULL_ADMIN
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, matrix_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 10: EXTERNAL DATA PROCESSORS & VENDOR DPA TRACKING (Form 10)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_data_processors (
    tenant_id VARCHAR(64) NOT NULL,
    processor_id VARCHAR(32) NOT NULL,
    processor_name VARCHAR(255) NOT NULL, -- e.g., Razorpay, Twilio, AWS, Gupshup
    service_provided VARCHAR(150) NOT NULL,
    dpa_signed BOOLEAN DEFAULT TRUE,
    data_shared_categories TEXT,
    country_hosted VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, processor_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 11: THIRD-PARTY DATA & NOMINEE REGISTER (Form 11, Section 14)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_third_party_data (
    tenant_id VARCHAR(64) NOT NULL,
    third_party_id VARCHAR(32) NOT NULL,
    principal_id VARCHAR(128) NOT NULL,
    nominee_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, third_party_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 12: TECHNICAL SAFEGUARDS & CONTROLS (Form 12, Section 8(5))
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_security_safeguards (
    tenant_id VARCHAR(64) NOT NULL,
    safeguard_id VARCHAR(32) NOT NULL,
    safeguard_title VARCHAR(255) NOT NULL,
    control_type VARCHAR(100) NOT NULL, -- ENCRYPTION_AT_REST, TLS_IN_TRANSIT, MFA, SIEM_LOGGING
    implementation_status VARCHAR(50) DEFAULT 'DEPLOYED',
    audit_frequency VARCHAR(50) DEFAULT 'ANNUAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, safeguard_id)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 13: MULTILINGUAL PRIVACY NOTICES (Form 13, Section 5)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_notices (
    tenant_id VARCHAR(64) NOT NULL,
    notice_id VARCHAR(32) NOT NULL,
    version_tag VARCHAR(20) NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en', -- 22 Scheduled Indian Languages
    notice_title VARCHAR(255) NOT NULL,
    notice_body_markdown TEXT NOT NULL,
    dpo_name VARCHAR(150) NOT NULL,
    dpo_email VARCHAR(255) NOT NULL,
    dpo_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, notice_id, version_tag, language_code)
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 14: IMMUTABLE CONSENT RECEIPTS & AUDIT LEDGER (Form 13, Section 6)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_consent_records (
    consent_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id VARCHAR(64) NOT NULL,
    principal_id VARCHAR(128) NOT NULL,
    notice_id VARCHAR(32) NOT NULL,
    notice_version VARCHAR(20) NOT NULL,
    consent_status VARCHAR(20) NOT NULL DEFAULT 'GIVEN', -- GIVEN, WITHDRAWN, EXPIRED
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    consent_signature_hash VARCHAR(64) NOT NULL, -- SHA-256 (principal + version + timestamp + salt)
    is_minor BOOLEAN DEFAULT FALSE,
    guardian_principal_id VARCHAR(128),
    given_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    withdrawn_at TIMESTAMP
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 15: GRANULAR PURPOSE-WISE CONSENT LINE ITEMS (Section 6 - Unbundled Checkboxes)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_consent_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    consent_id INTEGER NOT NULL,
    purpose_id VARCHAR(32) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consent_id) REFERENCES dpdp_consent_records(consent_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 16: DATA PRINCIPAL RIGHTS (DSR) REQUESTS (Sections 11, 12, 14)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_dsr_requests (
    request_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    principal_id VARCHAR(128) NOT NULL,
    request_type VARCHAR(40) NOT NULL, -- RIGHT_TO_ACCESS, RIGHT_TO_CORRECTION, RIGHT_TO_ERASURE, RIGHT_TO_NOMINATE
    request_status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, IN_REVIEW, ACTION_TAKEN, REJECTED_WITH_REASON
    rejection_reason TEXT,
    export_file_url TEXT,
    sla_deadline TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 17: GRIEVANCE REDRESSAL TICKETS (Section 13)
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_grievance_tickets (
    ticket_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    principal_id VARCHAR(128) NOT NULL,
    complaint_summary TEXT NOT NULL,
    ticket_status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, ASSIGNED_TO_DPO, RESOLVED, ESCALATED_TO_DPBI
    dpo_response_text TEXT,
    sla_deadline TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 18: RETENTION RULES & AUDIT DISPOSAL LOG (Form 08, Section 8(7))
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_retention_rules (
    tenant_id VARCHAR(64) NOT NULL,
    rule_id VARCHAR(32) NOT NULL,
    purpose_id VARCHAR(32) NOT NULL,
    retention_period_days INT NOT NULL,
    trigger_event VARCHAR(40) NOT NULL, -- ACCOUNT_CLOSURE, CONTRACT_TERMINATION, LAST_LOGIN
    disposal_action VARCHAR(40) NOT NULL, -- HARD_DELETE, CRYPTOGRAPHIC_SHREDDING, ANONYMIZATION
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, rule_id)
);

CREATE TABLE IF NOT EXISTS dpdp_disposal_log (
    disposal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id VARCHAR(64) NOT NULL,
    principal_id VARCHAR(128) NOT NULL,
    purpose_id VARCHAR(32) NOT NULL,
    disposal_method VARCHAR(40) NOT NULL,
    disposal_certificate_hash VARCHAR(64) NOT NULL,
    disposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------------------------------
-- TABLE 19: SECURITY SAFEGUARDS & BREACH INCIDENTS (Form 12, Section 8(6))
-- ----------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dpdp_breach_incidents (
    incident_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    incident_title VARCHAR(255) NOT NULL,
    severity_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    affected_principals_count INT DEFAULT 0,
    reported_to_dpbi BOOLEAN DEFAULT FALSE,
    dpbi_reported_at TIMESTAMP,
    principals_notified BOOLEAN DEFAULT FALSE,
    principals_notified_at TIMESTAMP,
    remediation_steps TEXT,
    discovered_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
