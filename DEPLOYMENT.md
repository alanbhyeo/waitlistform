# Vercel Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect GitHub Repository
1. Go to [https://vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New Project"** or **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose **GitHub** as your Git provider
5. Authorize Vercel to access your GitHub account if prompted
6. Select the repository: `alanbhyeo/waitlistform`
7. Click **"Import"**

### Step 2: Configure Project Settings
1. **Project Name**: `waitlistform` (or your preferred name)
2. **Framework Preset**: Select **"Other"** or **"Static Site"**
3. **Root Directory**: Leave as `.` (root)
4. **Build Command**: Leave empty (static site, no build needed)
5. **Output Directory**: Leave empty (or set to `.`)

### Step 3: Add Environment Variables
1. Click **"Environment Variables"** section
2. Add the following variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://dkgfuuenjbzsbtjiuhjn.supabase.co`
   - **Environment**: Production, Preview, Development (select all)
   
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_ZLrnZf-SImiW-5bdW1gOqA_ATYz8Pra`
   - **Environment**: Production, Preview, Development (select all)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your site will be live at a URL like: `https://waitlistform.vercel.app`

### Step 5: Update Supabase Config (Optional)
If you want to use environment variables in production, update `supabase-config.js`:

```javascript
const SUPABASE_URL = window.VITE_SUPABASE_URL || 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
const SUPABASE_ANON_KEY = window.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZLrnZf-SImiW-5bdW1gOqA_ATYz8Pra';
```

**Note**: For static HTML files, environment variables need to be injected at build time. Vercel can do this, but you may need to use a build step or keep the current hardcoded values (which is fine for public keys).

## Option 2: Deploy via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment

1. **Test the form**: Visit your deployed URL and test form submission
2. **Check Supabase**: Verify data appears in your Supabase dashboard
3. **Custom Domain** (optional): Add a custom domain in Vercel project settings

## Troubleshooting

- **404 errors**: Make sure `vercel.json` is committed and routes are configured correctly
- **Form not submitting**: Check browser console for errors and verify Supabase keys are correct
- **CORS errors**: Supabase should handle CORS automatically, but check RLS policies if issues occur

## Continuous Deployment

Once connected via GitHub, Vercel will automatically deploy:
- Every push to `main` branch → Production
- Every pull request → Preview deployment

No manual deployment needed!
