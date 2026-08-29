# Security Policy — TSA Server

**Last Updated:** August 29, 2026
**Effective Date:** August 29, 2026

---

## 1. Overview

Kelsologist takes the security of TSA Server and the data of its users seriously. This Security Policy describes our security practices and provides guidance for responsibly disclosing vulnerabilities.

---

## 2. Security Measures

### 2.1 Infrastructure Security
- All data in transit is encrypted using TLS 1.2 or higher.
- Data at rest is encrypted using AES-256.
- Infrastructure is hosted in SOC 2 / ISO 27001 certified environments.
- Regular vulnerability scanning and penetration testing are conducted.

### 2.2 Application Security
- We follow OWASP Top 10 security guidelines during development.
- Code undergoes security review before deployment.
- Dependencies are monitored and updated for known vulnerabilities.
- Automated static analysis (SAST) and dependency scanning are part of our CI/CD pipeline.

### 2.3 Access Control
- Access to production systems follows the principle of least privilege.
- Multi-factor authentication (MFA) is required for all privileged accounts.
- Access reviews are conducted periodically.
- All access is logged and monitored.

### 2.4 Incident Response
- We maintain an incident response plan to detect, contain, and remediate security incidents.
- In the event of a data breach affecting users, we will notify affected users and relevant authorities as required by applicable law.

---

## 3. Supported Versions

We provide security updates for the following versions of TSA Server:

| Version | Supported |
|---------|-----------|
| {{CURRENT_VERSION}} (latest) | ✅ Yes |
| {{PREVIOUS_VERSION}} | ✅ Yes (critical fixes only) |
| Older versions | ❌ No |

We encourage all users to keep their software up to date.

---

## 4. Vulnerability Disclosure (Responsible Disclosure)

We welcome security researchers and members of the public to help us keep TSA Server secure. If you discover a security vulnerability, please follow these guidelines:

### 4.1 What to Report
- Authentication or authorization flaws
- Injection vulnerabilities (SQL, XSS, command injection, etc.)
- Sensitive data exposure
- Insecure deserialization
- Security misconfiguration
- Cryptographic weaknesses

### 4.2 How to Report
**Email:** security@kelsologist.com

Please include:
1. A clear description of the vulnerability
2. Steps to reproduce the issue
3. Affected version(s) or component(s)
4. Potential impact
5. Any supporting materials (screenshots, PoC code)

### 4.3 Our Commitments
- We will acknowledge receipt of your report within **2 business days**.
- We will investigate and provide a status update within **10 business days**.
- We will not pursue legal action against researchers who act in good faith and follow these guidelines.
- We will credit researchers in our security advisories (unless you prefer to remain anonymous).

### 4.4 Out of Scope
The following are **not** in scope for our vulnerability disclosure program:
- Denial-of-service attacks
- Social engineering or phishing attempts
- Physical security attacks
- Vulnerabilities in third-party services we do not control
- Reports from automated scanners without evidence of exploitability

---

## 5. Bug Bounty

{{#if BUG_BOUNTY_ENABLED}}
We offer monetary rewards for qualifying vulnerability reports through our bug bounty program. Details are available at .
{{else}}
We do not currently offer a monetary bug bounty program but may offer recognition (e.g., hall of fame, swag) at our discretion.
{{/if}}

---

## 6. Security Updates and Advisories

Security advisories for TSA Server are published at https://github.com/Kelsologist/tsa-server/security/advisories. Subscribe to our release notes or security mailing list to receive notifications.

---

## 7. Compliance

TSA Server is designed to support compliance with:

- GDPR (General Data Protection Regulation)
- SOC 2 Type II
- eIDAS, RFC 3161

Contact us for compliance documentation or Data Processing Agreements (DPAs).

---

## 8. Contact

For security inquiries:

**Kelsologist Security Team**
Email: security@kelsologist.com
PGP Key:  *(optional)*
