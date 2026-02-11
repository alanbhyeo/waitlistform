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
   - ⚠️ Ready for deployment via Vercel Dashboard (see DEPLOYMENT.md)
   - ⚠️ Set environment variables in Vercel dashboard (optional)
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

For production deployment on Vercel, you should use environment variables instead of hardcoding credentials in `supabase-config.js`:

1. In Vercel dashboard, go to your project settings
2. Add environment variables:
   - `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` (depending on framework)
   - `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Update `supabase-config.js` to read from environment variables:
   ```javascript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-key-here';
   ```

**Note**: For static HTML files, you may need to use a build tool or server-side rendering to inject environment variables, or use Vercel's environment variable injection feature.
