# policy

Policy source-of-truth repository for public legal pages, internal compliance references, and generated app-specific policy documents for all Kelsologist applications.

## Repository Structure

```
policy/
├── policies/
│   ├── public/          # Public-facing policies rendered in the app
│   └── compliance/      # Internal compliance/security references
├── templates/           # Master parameterized templates (single source of truth)
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   ├── cookie-policy.md
│   ├── security-policy.md
│   └── data-retention-policy.md
├── ara/                 # Generated policies for Ara
├── tsa-server/          # Generated policies for TSA Server
├── aion-sign/           # Generated policies for Aion Sign
├── app-integration/     # Implementation artifacts for routes, links, and consent tracking
│   ├── reference-api/   # Runnable reference API with policy and request endpoints
│   ├── sql/             # Schema for policy acceptance tracking
│   └── templates/       # Legal link templates
├── generate_policies.py # Script to regenerate app-specific policies from templates
├── POLICY_INDEX.md      # Mapping of stable public URLs to policy files
└── CHANGELOG.md         # Policy change history
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

## Publishing to Your App

1. Render markdown files from `/policies/public/` as legal pages.
2. Keep stable URLs: `/privacy`, `/terms`, `/data-deletion` (and `/cookies` if used).
3. Link legal pages in footer, signup/login, checkout, and account settings.
4. Store user acceptance timestamp and accepted policy version during signup.

## Integration Quickstart (Existing In-Progress App)

1. Load route/file/version mappings from `app-integration/policy-manifest.json`.
2. Add policy routes for `/privacy`, `/terms`, `/data-deletion`, and `/cookies`.
3. Add legal links using `app-integration/templates/legal-links.json`.
4. Create backend tables from `app-integration/sql/policy_acceptance_schema.sql`.
5. Follow phased implementation in `app-integration/thin-legal-layer.md`.
6. Use `app-integration/reference-api/README.md` for a working endpoint reference.

## Updating / Regenerating App-Specific Policies

### 1. Edit a template
Modify the relevant file in `templates/`. Use `{{VARIABLE_NAME}}` placeholders for values that differ per app.

### 2. Update app-specific values
Open `generate_policies.py` and update the `APPS` dictionary.

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

### Remaining Placeholders

Some generated policies still contain unfilled placeholders. Find them with:

```bash
grep -rn '{{' ara/ tsa-server/ aion-sign/
```

Key placeholders to fill in `generate_policies.py`:
- `{{COMPANY_ADDRESS}}` — legal registered address
- `{{GOVERNING_JURISDICTION}}` — applicable law jurisdiction
- `{{ARBITRATION_VENUE}}` — arbitration location
- `{{CURRENT_VERSION}}` / `{{PREVIOUS_VERSION}}` — current app version numbers

## Governance

- Changes to policy files should be merged only through reviewed pull requests.
- Every policy content change must update `CHANGELOG.md`.
- Include `Effective date`, `Last updated`, and `Version` in each policy file.
