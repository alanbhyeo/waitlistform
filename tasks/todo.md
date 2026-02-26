# Current Task
[None - security review completed]

## Completed: Security Review (2025-02-26)

## Objective
Security review of waitlist form project: find and fix vulnerabilities.

## Plan
- [x] Document findings and create SECURITY.md
- [x] Remove hardcoded secrets; use placeholders and build-time injection
- [x] Harden error handling; add CSP, SRI, security headers
- [x] Add input length limits and sanitization

## Review
**Status**: Complete
**Changes Made**:
- `SECURITY.md`: Full findings and fixes; checklist for env vars and key rotation
- `supabase-config.js`: Placeholders only; no secrets in repo
- `build.js`: No fallback secrets; clear error when env missing
- `form-handler.js`: Generic user error message (no raw `error.message`); length validation; phone formatting moved from inline script
- `form.html`: SRI + crossorigin on Supabase script; maxlength on all text inputs; inline script removed (CSP)
- `vercel.json`: Content-Security-Policy, Referrer-Policy
- `README.md`, `DEPLOYMENT.md`, `VERCEL_ENV_VARS.md`: Placeholders for keys/URLs; point to env and SECURITY.md

**Verification**:
- `VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run build` runs and injects config
- supabase-config.js restored to placeholders after test build
