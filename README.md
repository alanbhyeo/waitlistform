# Waitlist Form Project

This project contains a person details webform with the following features:

## Architecture

```
┌────────────────────┐
│  User Browser      │
│  (Desktop / Mobile)│
└─────────┬──────────┘
          │ HTTPS
          ▼
┌────────────────────┐
│  Vercel             │
│  Frontend Web App   │
│  (HTML / React /    │
│   Next.js Form)     │
└─────────┬──────────┘
          │ supabase-js (REST)
          ▼
┌────────────────────────────────┐
│  Supabase                       │
│  ├─ Postgres Database (CRM)     │
│  ├─ Row Level Security (RLS)    │
│  ├─ Auto REST API               │
│  └─ Dashboard / Admin UI        │
└────────────────────────────────┘
```

## Files

- `form.html` - Main HTML form with person details fields
- `styles.css` - Modern, responsive CSS styling
- `form-handler.js` - Form submission handler using supabase-js ✅
- `supabase-config.js` - Supabase client configuration ✅
- `.gitignore` - Git ignore rules
- `vercel.json` - Vercel deployment configuration (if needed)

## Form Fields

- First Name (required)
- Last Name (required)
- Email Address (required)
- Mobile (required) - Format: 04XX XXX XXX (Australian mobile)
- Date of Birth (optional)
- Street Address
- City, State (Australian states picklist: NSW, VIC, QLD, ACT, NT, WA, TAS, SA), Postcode

## Next Steps

1. ✅ Set up Supabase database and table
   - ✅ Created `customer` table with all form fields
   - ✅ Configured Row Level Security (RLS) policies with validation
   - ✅ Added database constraints for data validation
   - ✅ Connected to Supabase project

2. ✅ Create Supabase client configuration
   - ✅ Created `supabase-config.js` with Supabase client initialization
   - ✅ Configured to use environment variables (injected at build time)
   - ✅ Created build script for environment variable injection

3. ✅ Add form submission handler
   - ✅ Created `form-handler.js` using supabase-js
   - ✅ Handles form validation and submission
   - ✅ Inserts data directly into Supabase from frontend
   - ✅ Error handling and user feedback

4. Configure n8n webhook workflow (optional)
   - Set up Supabase database webhook or trigger
   - Configure n8n workflow to receive notifications
   - Set up Slack notification integration

5. ✅ Deploy to Vercel
   - ✅ Created `vercel.json` configuration file
   - ✅ Created `build.js` for environment variable injection
   - ✅ Created `package.json` with build scripts
   - ✅ Ready for deployment via Vercel Dashboard (see DEPLOYMENT.md)
   - ⚠️ **Action Required**: Set environment variables in Vercel dashboard (REQUIRED)
   - ⚠️ Deploy and test form submission flow

6. Test form submission flow
   - Test end-to-end submission from browser
   - Verify data in Supabase dashboard
   - Verify n8n/Slack notifications (if configured)

## Tech Stack

- **Frontend Hosting**: Vercel
- **Frontend**: HTML + CSS + JavaScript
- **Database**: Supabase (Postgres)
- **Client Library**: supabase-js (REST API)
- **Automation**: n8n (webhook → Slack notification, optional)

## Environment Variables (for Vercel)

**REQUIRED**: Environment variables must be set in Vercel dashboard for the build to work.

1. In Vercel dashboard, go to your project settings → Environment Variables
2. Add these variables (see `VERCEL_ENV_VARS.md` for detailed instructions):
   - `VITE_SUPABASE_URL`: `https://dkgfuuenjbzsbtjiuhjn.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_ZLrnZf-SImiW-5bdW1gOqA_ATYz8Pra`
3. Select all environments (Production, Preview, Development)
4. The build script (`build.js`) automatically injects these values at build time

**Local Development**: Run `npm run build` before testing, or the fallback values will be used.
