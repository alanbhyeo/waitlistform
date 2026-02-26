# How to Add Environment Variables in Vercel

## Quick Steps

### Method 1: During Project Setup
1. After importing your GitHub repo, you'll see the "Configure Project" page
2. Scroll down to find the **"Environment Variables"** section
3. Click **"Add"** or the **"+"** button
4. For each variable:
   - Enter the **Name**
   - Enter the **Value**
   - Select **Environments** (Production, Preview, Development - select all)
   - Click **"Add"**

### Method 2: After Project is Deployed
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `waitlistform`
3. Click **"Settings"** tab (top navigation)
4. Click **"Environment Variables"** in the left sidebar
5. Click **"Add New"** button
6. Enter:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL (from Supabase Dashboard → Settings → API)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **"Save"**
7. Repeat for second variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon (publishable) key from Dashboard → Settings → API
   - **Environments**: Select all
   - Click **"Save"**
8. **Redeploy**: Go to "Deployments" tab → Click "..." on latest deployment → "Redeploy"

## Visual Guide

```
Vercel Dashboard
  └─ Your Project (waitlistform)
      └─ Settings
          └─ Environment Variables
              └─ [Add New]
                  ├─ Name: VITE_SUPABASE_URL
                  ├─ Value: https://dkgfuuenjbzsbtjiuhjn.supabase.co
                  └─ Environments: ☑ Production ☑ Preview ☑ Development
```

## Important Note

**For Static HTML Files**: Environment variables in Vercel are typically used during build time. Since this is a static HTML site without a build step, the environment variables won't automatically be available in your browser JavaScript.

**Current Setup**: The project uses a build step (`npm run build`) that injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `supabase-config.js`. Do not commit real keys; set them in Vercel (and in `.env` for local development). See `SECURITY.md` for details.
