# policy

This repository contains policy templates and generated policy documents for all Kelsologist applications.

## Structure

```
policy/
├── templates/                   # Master templates (single source of truth)
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   ├── cookie-policy.md
│   ├── security-policy.md
│   └── data-retention-policy.md
├── ara/                         # Generated policies for Ara
├── tsa-server/                  # Generated policies for TSA Server
├── aion-sign/                   # Generated policies for Aion Sign
└── generate_policies.py         # Script to regenerate all policies
```

## Policy Types

| Policy | Description |
|--------|-------------|
| **Privacy Policy** | How user data is collected, used, and protected |
| **Terms of Service** | Rules governing use of the Service |
| **Cookie Policy** | Cookies and tracking technologies used |
| **Security Policy** | Security practices and vulnerability disclosure |
| **Data Retention Policy** | How long data is kept and how it is deleted |

## Apps Covered

| App | Description |
|-----|-------------|
| **ara** | AI-powered research and analysis platform |
| **tsa-server** | Timestamp authority server (RFC 3161 / eIDAS) |
| **aion-sign** | Digital document signing and workflow automation |

## Updating Policies

### 1. Edit a template
Modify the relevant file in `templates/`. Use `{{VARIABLE_NAME}}` placeholders for values that differ per app.

### 2. Update app-specific values
Open `generate_policies.py` and update the `APPS` dictionary with the correct values for each app.

### 3. Regenerate all policies
```bash
python3 generate_policies.py
```

### 4. Regenerate for a single app
```bash
python3 generate_policies.py --app ara
python3 generate_policies.py --app tsa-server
python3 generate_policies.py --app aion-sign
```

## Remaining Placeholders

Some placeholders in the generated policies still need real values filled in. Search for `{{` in any generated file to find them:

```bash
grep -rn '{{' ara/ tsa-server/ aion-sign/
```

Key placeholders to fill:
- `{{COMPANY_ADDRESS}}` — legal registered address
- `{{GOVERNING_JURISDICTION}}` — applicable law jurisdiction
- `{{ARBITRATION_VENUE}}` — arbitration location
- `{{CURRENT_VERSION}}` / `{{PREVIOUS_VERSION}}` — current app version numbers
