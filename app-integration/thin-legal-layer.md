# Thin Legal Layer Integration Guide

## 1) Add stable routes now
Use the policy manifest at `/home/runner/work/policy/policy/app-integration/policy-manifest.json` and add these routes in your app:
- `/privacy`
- `/terms`
- `/data-deletion`
- `/cookies`

Each route should render markdown from the mapped file in `/home/runner/work/policy/policy/policies/public/`.

## 2) Add legal links early
Add links to policy pages in these app locations:
- Global footer (all pages)
- Signup/login
- Checkout/payment
- Account/settings

Use `/home/runner/work/policy/policy/app-integration/templates/legal-links.json` as a placement checklist.

## 3) Track acceptance metadata at signup
Persist the following on consent:
- user/account id
- policy key
- accepted policy version
- acceptance timestamp

Use `/home/runner/work/policy/policy/app-integration/sql/policy_acceptance_schema.sql` to create the tracking table.

## 4) Keep URLs stable
Use `/home/runner/work/policy/policy/POLICY_INDEX.md` as canonical mapping for route stability.
Do not rename `/privacy`, `/terms`, `/data-deletion`; add redirects if route changes become unavoidable.

## 5) Implement rights handling in phases
- **Phase 1**: Contact-based request intake (email/support form into `data_rights_requests`)
- **Phase 2**: Self-serve request submission in account settings
- **Phase 3**: Automated fulfillment workflows with audit trail

## 6) Keep policy updates safe while app evolves
- Treat this repository as source of truth for legal content.
- Update `/home/runner/work/policy/policy/CHANGELOG.md` on policy changes.
- Re-prompt users to accept updated Terms/Privacy when changes are material.
