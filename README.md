# policy

Policy source-of-truth repository for public legal pages and internal compliance references.

## Repository Structure
- `/policies/public/` - public-facing policies rendered in the app
- `/policies/compliance/` - internal compliance/security references
- `/app-integration/` - implementation artifacts for routes, links, and consent tracking
- `/app-integration/reference-api/` - runnable reference API with policy and request endpoints
- `/POLICY_INDEX.md` - mapping of stable public URLs to policy files
- `/CHANGELOG.md` - policy change history

## Publishing to Your App
1. Render markdown files from `/policies/public/` as legal pages.
2. Keep stable URLs: `/privacy`, `/terms`, `/data-deletion` (and `/cookies` if used).
3. Link legal pages in footer, signup/login, checkout, and account settings.
4. Store user acceptance timestamp and accepted policy version during signup.

## Integration Quickstart (Existing In-Progress App)
1. Load route/file/version mappings from `/home/runner/work/policy/policy/app-integration/policy-manifest.json`.
2. Add policy routes for `/privacy`, `/terms`, `/data-deletion`, and `/cookies`.
3. Add legal links using `/home/runner/work/policy/policy/app-integration/templates/legal-links.json`.
4. Create backend tables from `/home/runner/work/policy/policy/app-integration/sql/policy_acceptance_schema.sql`.
5. Follow phased implementation in `/home/runner/work/policy/policy/app-integration/thin-legal-layer.md`.
6. Use `/home/runner/work/policy/policy/app-integration/reference-api/README.md` for a working endpoint reference.

## Governance
- Changes to policy files should be merged only through reviewed pull requests.
- Every policy content change must update `CHANGELOG.md`.
- Include `Effective date`, `Last updated`, and `Version` in each policy file.
