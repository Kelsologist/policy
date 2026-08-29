# policy

Policy source-of-truth repository for public legal pages and internal compliance references.

## Repository Structure
- `/policies/public/` - public-facing policies rendered in the app
- `/policies/compliance/` - internal compliance/security references
- `/POLICY_INDEX.md` - mapping of stable public URLs to policy files
- `/CHANGELOG.md` - policy change history

## Publishing to Your App
1. Render markdown files from `/policies/public/` as legal pages.
2. Keep stable URLs: `/privacy`, `/terms`, `/data-deletion` (and `/cookies` if used).
3. Link legal pages in footer, signup/login, checkout, and account settings.
4. Store user acceptance timestamp and accepted policy version during signup.

## Governance
- Changes to policy files should be merged only through reviewed pull requests.
- Every policy content change must update `CHANGELOG.md`.
- Include `Effective date`, `Last updated`, and `Version` in each policy file.
