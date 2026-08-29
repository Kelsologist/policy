# Data Retention Policy — {{APP_NAME}}

**Last Updated:** {{LAST_UPDATED}}
**Effective Date:** {{EFFECTIVE_DATE}}

---

## 1. Purpose

This Data Retention Policy defines how long {{COMPANY_NAME}} retains personal and operational data collected through {{APP_NAME}}, and the procedures for securely disposing of data when retention periods expire.

---

## 2. Scope

This policy applies to all data processed by {{APP_NAME}}, including:
- User account and profile data
- Transaction and activity logs
- Support and communication records
- System and security logs
- Backups and archives

---

## 3. Retention Schedule

| Data Category | Retention Period | Basis | Disposal Method |
|---------------|-----------------|-------|----------------|
| Account / Profile Data | Duration of account + {{POST_ACCOUNT_DELETION_DAYS}} days | Contractual necessity | Secure deletion |
| Authentication Logs | {{AUTH_LOG_RETENTION_DAYS}} days | Security & legal compliance | Secure deletion |
| Transaction Records | {{TRANSACTION_RETENTION_YEARS}} years | Legal / financial obligation | Secure archival, then deletion |
| Support Tickets & Correspondence | {{SUPPORT_RETENTION_YEARS}} years after resolution | Legitimate interest | Secure deletion |
| Analytics & Usage Data | {{ANALYTICS_RETENTION_MONTHS}} months | Legitimate interest | Anonymization or deletion |
| System / Application Logs | {{SYSTEM_LOG_RETENTION_DAYS}} days | Security monitoring | Secure deletion |
| Security Incident Records | {{INCIDENT_RETENTION_YEARS}} years | Legal obligation | Secure archival |
| Backups | {{BACKUP_RETENTION_DAYS}} days | Business continuity | Secure overwrite |
| Marketing Preferences | Until consent withdrawn + 30 days | Consent | Secure deletion |

---

## 4. Special Categories of Data

Special category data (health, biometrics, financial, etc.) is subject to stricter retention limits. Such data is:
- Retained only for the minimum period required by law or contract.
- Stored with additional access controls.
- Disposed of with enhanced verification.

---

## 5. Legal Holds

When data is subject to a legal hold, litigation, or regulatory investigation, normal retention schedules are suspended. The data is preserved until the legal hold is lifted, at which point standard retention rules resume.

---

## 6. Data Deletion and Anonymization

### 6.1 Account Deletion
When a user deletes their account:
- Personal identifiers are removed or anonymized within **{{DELETION_PROCESSING_DAYS}} days**.
- Backups containing the data are purged within **{{BACKUP_PURGE_DAYS}} days**.
- Certain data may be retained longer if required by law (e.g., financial records).

### 6.2 Anonymization
Where full deletion is not possible (e.g., aggregate analytics), data is anonymized so that it can no longer be linked to an individual.

### 6.3 Secure Disposal Methods
| Medium | Method |
|--------|--------|
| Electronic storage | Cryptographic erasure or multi-pass overwrite |
| Cloud storage | Verified deletion via provider APIs + confirmation |
| Physical media (if any) | Shredding or degaussing |

---

## 7. Third-Party Data Processors

We require all third-party processors handling data on our behalf to adhere to retention schedules consistent with this policy, as documented in our Data Processing Agreements (DPAs).

---

## 8. Responsibilities

| Role | Responsibility |
|------|---------------|
| Data Protection Officer (DPO) | Oversee policy compliance; approve exceptions |
| Engineering Team | Implement automated retention and deletion mechanisms |
| Legal Team | Manage legal holds and regulatory requirements |
| Operations Team | Ensure physical and cloud media are properly disposed |

---

## 9. Policy Review

This policy is reviewed annually or whenever there are significant changes to applicable law, technology, or business processes. Reviews are documented and approved by {{DPO_TITLE}} or equivalent.

---

## 10. Exceptions

Requests for exceptions to this policy must be submitted in writing to {{PRIVACY_EMAIL}} and approved by the DPO. All approved exceptions are documented.

---

## 11. Contact Us

For data retention inquiries or to submit a deletion request:

**{{COMPANY_NAME}}**
Email: {{PRIVACY_EMAIL}}
Address: {{COMPANY_ADDRESS}}
