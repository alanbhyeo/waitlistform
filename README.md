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
- `form-handler.js` - Form submission handler using supabase-js (to be created)
- `supabase-config.js` - Supabase client configuration (to be created)
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

1. Set up Supabase database and table
   - Create Postgres table for form submissions
   - Configure Row Level Security (RLS) policies
   - Set up Supabase project and get API keys

2. Create Supabase client configuration
   - Create `supabase-config.js` with Supabase client initialization
   - Configure environment variables for Vercel

3. Add form submission handler
   - Create `form-handler.js` using supabase-js
   - Handle form validation and submission
   - Insert data directly into Supabase from frontend

4. Configure n8n webhook workflow (optional)
   - Set up Supabase database webhook or trigger
   - Configure n8n workflow to receive notifications
   - Set up Slack notification integration

5. Deploy to Vercel
   - Configure Vercel project
   - Set environment variables
   - Deploy and test form submission flow

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
