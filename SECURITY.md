# Security Review – Waitlist Form

**Date**: 2025-02-26  
**Scope**: form.html, form-handler.js, supabase-config.js, build.js, vercel.json, docs

---

## Executive Summary

The app is a static waitlist form that posts to Supabase from the browser. Several issues were found: **secrets committed in source and docs**, **no CSP or SRI**, **error message leakage**, and **missing input length limits**. Fixes are applied below; one critical follow-up is **rotating the Supabase anon key** if it was ever pushed to a public repo.

---

## Findings and Fixes

### CRITICAL

#### 1. Supabase URL and anon key committed in source and docs

**Risk**: Anyone with repo access (or if the repo is public) can see your Supabase project URL and anon key. The anon key is intended to be public in frontend builds, but it should be injected at build time from environment variables, not stored in the repo. Committed keys also make rotation and per-environment config harder.

**Locations**:  
- `supabase-config.js` (hardcoded)  
- `build.js` (fallback values)  
- `README.md`, `DEPLOYMENT.md`, `VERCEL_ENV_VARS.md` (documentation)

**Fix applied**:
- `supabase-config.js` now uses placeholders `{{SUPABASE_URL}}` and `{{SUPABASE_ANON_KEY}}`; `build.js` replaces them at build time. No secrets in the committed file.
- `build.js` no longer contains fallback secrets; it fails with a clear error if env vars are missing (local dev should use `.env` or Vercel env).
- Docs updated to use placeholders (e.g. `https://YOUR_PROJECT.supabase.co`, `your-anon-key`) and to point to Vercel env vars.

**Your action**:  
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel (and in local `.env` for dev).  
- If this repo has ever been public or shared, **rotate the Supabase anon key** in Supabase Dashboard → Settings → API, then update the value in Vercel and locally.

---

### HIGH

#### 2. Raw error messages shown to users

**Risk**: `handleSubmissionError` sometimes set `errorMessage = error.message`. Supabase (and other) errors can include internal details, stack traces, or DB hints, which aid attackers and hurt UX.

**Fix applied**:  
- User-facing message is now a generic “An error occurred…” for any unexpected error.  
- Specific handling kept only for known codes (e.g. 23505 duplicate, 23514 constraint, RLS).  
- Full error is only logged with `console.error` (no sensitive data in the message in normal use).

#### 3. No Subresource Integrity (SRI) on CDN script

**Risk**: If the CDN (jsDelivr) is compromised or a dependency is malicious, the browser could run altered JavaScript.

**Fix applied**:  
- Added `integrity` and `crossorigin="anonymous"` to the Supabase script tag in `form.html` using the official CDN file’s SHA-384 hash.  
- If you change the Supabase library version, update the `integrity` value (e.g. from [jsDelivr](https://www.jsdelivr.com/) or by computing it locally).

#### 4. No Content-Security-Policy (CSP)

**Risk**: No CSP allows any script source, increasing impact of XSS or injected scripts.

**Fix applied**:  
- Added a strict `Content-Security-Policy` in `vercel.json`:  
  - `script-src`: self + Supabase CDN (and the same origin for inline script if needed).  
  - Other directives (e.g. `default-src`, `form-action`, `frame-ancestors`) set to tighten the page.  
- Kept `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`; added `Referrer-Policy: strict-origin-when-cross-origin`.

---

### MEDIUM

#### 5. No input length limits

**Risk**: Very long strings in text fields could stress the DB, cause poor UX, or be used for DoS. Supabase/Postgres will have limits, but the app should enforce reasonable bounds.

**Fix applied**:  
- Added `maxlength` on all relevant inputs in `form.html` (first/last name, email, street, city, postcode) and kept existing phone/date validation.  
- Validation in `form-handler.js` trims and checks length before submit; optional fields can be empty but not oversized.

#### 6. Optional reflected / stored XSS

**Risk**: Form data is sent to Supabase and could later be shown in an admin UI or emails. If that output is ever rendered as HTML without escaping, it could be XSS. The current form only uses `textContent` for messages, which is safe.

**Fix applied**:  
- No code change required in this repo. Recommendation: wherever this data is displayed (Supabase dashboard, n8n, Slack, email), ensure it is rendered as plain text or properly escaped (e.g. HTML-escaped or in a safe template).  
- CSP (above) reduces impact of any future XSS.

---

### LOW / INFORMATIONAL

#### 7. Security headers

**Status**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block` were already set.  
**Fix**: Added CSP and `Referrer-Policy` as above.

#### 8. HTTPS and Supabase

**Status**: Vercel serves over HTTPS; Supabase client uses the project URL. No change.

#### 9. Rate limiting

**Status**: Form submission is client → Supabase directly. Supabase applies its own rate limits. Optional: add client-side “submit cooldown” to reduce accidental double-submits (UX, not a security fix).

#### 10. Dependencies

**Status**: Only Supabase is loaded from CDN; version is pinned (e.g. 2.39.3). No npm dependencies with known critical issues. Keep the Supabase version and SRI hash in sync when upgrading.

---

## Checklist After Applying Fixes

- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel (and in local `.env` for dev).  
- [ ] Run `npm run build` and confirm the form still loads and submits (build injects config).  
- [ ] If the repo was ever public or shared: rotate Supabase anon key and update env vars.  
- [ ] When upgrading `@supabase/supabase-js`, update the script `src` and `integrity` in `form.html`.  
- [ ] Ensure any admin or notification UI that displays waitlist data escapes/renders it safely.

---

## File Change Summary

| File | Change |
|------|--------|
| `supabase-config.js` | Use `{{SUPABASE_URL}}` / `{{SUPABASE_ANON_KEY}}` placeholders only |
| `build.js` | Remove hardcoded fallbacks; require env and exit with clear error |
| `form-handler.js` | Generic user error message; length checks; no raw `error.message` to user |
| `form.html` | SRI + crossorigin on Supabase script; `maxlength` on inputs |
| `vercel.json` | Add CSP and Referrer-Policy headers |
| `README.md` / `DEPLOYMENT.md` / `VERCEL_ENV_VARS.md` | Replace real keys/URLs with placeholders and env instructions |
| `SECURITY.md` | This document |
