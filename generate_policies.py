#!/usr/bin/env python3
"""
generate_policies.py

Generates app-specific policy files from templates by substituting
placeholder variables with app-specific values.

Usage:
    python generate_policies.py               # generate all apps
    python generate_policies.py --app ara     # generate one app
"""

import argparse
import os
import re
import sys
from datetime import date

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")
POLICY_FILES = [
    "privacy-policy.md",
    "terms-of-service.md",
    "cookie-policy.md",
    "security-policy.md",
    "data-retention-policy.md",
]

TODAY = date.today().strftime("%B %d, %Y")

# ---------------------------------------------------------------------------
# App configurations — update values here whenever app details change
# ---------------------------------------------------------------------------
APPS = {
    "ara": {
        "APP_NAME": "Ara",
        "APP_DESCRIPTION": "an AI-powered research and analysis platform",
        "COMPANY_NAME": "Kelsologist",
        "COMPANY_ADDRESS": "{{COMPANY_ADDRESS}}",
        "PRIVACY_EMAIL": "privacy@kelsologist.com",
        "SUPPORT_EMAIL": "support@kelsologist.com",
        "SECURITY_EMAIL": "security@kelsologist.com",
        "LAST_UPDATED": TODAY,
        "EFFECTIVE_DATE": TODAY,
        "GOVERNING_JURISDICTION": "{{GOVERNING_JURISDICTION}}",
        "ARBITRATION_VENUE": "{{ARBITRATION_VENUE}}",
        "CURRENT_VERSION": "{{CURRENT_VERSION}}",
        "PREVIOUS_VERSION": "{{PREVIOUS_VERSION}}",
        "ACKNOWLEDGEMENT_SLA": "2",
        "INVESTIGATION_SLA": "10",
        "BUG_BOUNTY_ENABLED": "false",
        "BUG_BOUNTY_URL": "",
        "SECURITY_ADVISORIES_URL": "https://github.com/Kelsologist/ara/security/advisories",
        "PGP_KEY_URL": "",
        "ADDITIONAL_COMPLIANCE_STANDARDS": "CCPA",
        "POST_ACCOUNT_DELETION_DAYS": "30",
        "AUTH_LOG_RETENTION_DAYS": "90",
        "TRANSACTION_RETENTION_YEARS": "7",
        "SUPPORT_RETENTION_YEARS": "3",
        "ANALYTICS_RETENTION_MONTHS": "26",
        "SYSTEM_LOG_RETENTION_DAYS": "90",
        "INCIDENT_RETENTION_YEARS": "5",
        "BACKUP_RETENTION_DAYS": "30",
        "DELETION_PROCESSING_DAYS": "30",
        "BACKUP_PURGE_DAYS": "60",
        "DPO_TITLE": "Data Protection Officer",
        "DNT_RESPONSE": "do not currently",
        "PAID_SERVICE": "false",
    },
    "tsa-server": {
        "APP_NAME": "TSA Server",
        "APP_DESCRIPTION": "a timestamp authority server providing trusted time-stamping services",
        "COMPANY_NAME": "Kelsologist",
        "COMPANY_ADDRESS": "{{COMPANY_ADDRESS}}",
        "PRIVACY_EMAIL": "privacy@kelsologist.com",
        "SUPPORT_EMAIL": "support@kelsologist.com",
        "SECURITY_EMAIL": "security@kelsologist.com",
        "LAST_UPDATED": TODAY,
        "EFFECTIVE_DATE": TODAY,
        "GOVERNING_JURISDICTION": "{{GOVERNING_JURISDICTION}}",
        "ARBITRATION_VENUE": "{{ARBITRATION_VENUE}}",
        "CURRENT_VERSION": "{{CURRENT_VERSION}}",
        "PREVIOUS_VERSION": "{{PREVIOUS_VERSION}}",
        "ACKNOWLEDGEMENT_SLA": "2",
        "INVESTIGATION_SLA": "10",
        "BUG_BOUNTY_ENABLED": "false",
        "BUG_BOUNTY_URL": "",
        "SECURITY_ADVISORIES_URL": "https://github.com/Kelsologist/tsa-server/security/advisories",
        "PGP_KEY_URL": "",
        "ADDITIONAL_COMPLIANCE_STANDARDS": "eIDAS, RFC 3161",
        "POST_ACCOUNT_DELETION_DAYS": "30",
        "AUTH_LOG_RETENTION_DAYS": "365",
        "TRANSACTION_RETENTION_YEARS": "10",
        "SUPPORT_RETENTION_YEARS": "3",
        "ANALYTICS_RETENTION_MONTHS": "26",
        "SYSTEM_LOG_RETENTION_DAYS": "365",
        "INCIDENT_RETENTION_YEARS": "7",
        "BACKUP_RETENTION_DAYS": "90",
        "DELETION_PROCESSING_DAYS": "30",
        "BACKUP_PURGE_DAYS": "120",
        "DPO_TITLE": "Data Protection Officer",
        "DNT_RESPONSE": "do not currently",
        "PAID_SERVICE": "true",
    },
    "aion-sign": {
        "APP_NAME": "Aion Sign",
        "APP_DESCRIPTION": "a digital document signing and workflow automation platform",
        "COMPANY_NAME": "Kelsologist",
        "COMPANY_ADDRESS": "{{COMPANY_ADDRESS}}",
        "PRIVACY_EMAIL": "privacy@kelsologist.com",
        "SUPPORT_EMAIL": "support@kelsologist.com",
        "SECURITY_EMAIL": "security@kelsologist.com",
        "LAST_UPDATED": TODAY,
        "EFFECTIVE_DATE": TODAY,
        "GOVERNING_JURISDICTION": "{{GOVERNING_JURISDICTION}}",
        "ARBITRATION_VENUE": "{{ARBITRATION_VENUE}}",
        "CURRENT_VERSION": "{{CURRENT_VERSION}}",
        "PREVIOUS_VERSION": "{{PREVIOUS_VERSION}}",
        "ACKNOWLEDGEMENT_SLA": "2",
        "INVESTIGATION_SLA": "10",
        "BUG_BOUNTY_ENABLED": "false",
        "BUG_BOUNTY_URL": "",
        "SECURITY_ADVISORIES_URL": "https://github.com/Kelsologist/aion-sign/security/advisories",
        "PGP_KEY_URL": "",
        "ADDITIONAL_COMPLIANCE_STANDARDS": "eIDAS, ESIGN Act, UETA",
        "POST_ACCOUNT_DELETION_DAYS": "30",
        "AUTH_LOG_RETENTION_DAYS": "365",
        "TRANSACTION_RETENTION_YEARS": "10",
        "SUPPORT_RETENTION_YEARS": "5",
        "ANALYTICS_RETENTION_MONTHS": "26",
        "SYSTEM_LOG_RETENTION_DAYS": "365",
        "INCIDENT_RETENTION_YEARS": "7",
        "BACKUP_RETENTION_DAYS": "90",
        "DELETION_PROCESSING_DAYS": "30",
        "BACKUP_PURGE_DAYS": "120",
        "DPO_TITLE": "Data Protection Officer",
        "DNT_RESPONSE": "do not currently",
        "PAID_SERVICE": "true",
    },
}


def render_template(template_path: str, variables: dict) -> str:
    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()
    for key, value in variables.items():
        content = content.replace("{{" + key + "}}", value)
    return content


def generate_for_app(app_name: str) -> None:
    if app_name not in APPS:
        print(f"ERROR: Unknown app '{app_name}'. Known apps: {', '.join(APPS)}", file=sys.stderr)
        sys.exit(1)

    variables = APPS[app_name]
    output_dir = os.path.join(os.path.dirname(__file__), app_name)
    os.makedirs(output_dir, exist_ok=True)

    for policy_file in POLICY_FILES:
        template_path = os.path.join(TEMPLATES_DIR, policy_file)
        if not os.path.exists(template_path):
            print(f"WARNING: Template not found: {template_path}", file=sys.stderr)
            continue
        rendered = render_template(template_path, variables)
        output_path = os.path.join(output_dir, policy_file)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(rendered)
        print(f"  Generated: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate app-specific policy documents.")
    parser.add_argument("--app", help="Generate policies for a specific app only", choices=list(APPS.keys()))
    args = parser.parse_args()

    apps_to_generate = [args.app] if args.app else list(APPS.keys())

    for app in apps_to_generate:
        print(f"\n==> {app}")
        generate_for_app(app)

    print("\nDone.")


if __name__ == "__main__":
    main()
