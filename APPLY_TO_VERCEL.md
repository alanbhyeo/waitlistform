# Apply These Changes to Vercel

Follow these steps to get the security fixes and current code live on Vercel.

---

## 1. Commit and push your code

If you haven’t already, commit and push so Vercel can use the latest code:

```bash
git add .
git status   # review
git commit -m "Security fixes: CSP, SRI, no secrets in repo, input limits"
git push origin main
```

(Use your real branch name if it’s not `main`.)

---

## 2. Set environment variables in Vercel

The build **requires** these; without them it will fail.

1. Open **[Vercel Dashboard](https://vercel.com/dashboard)** → your **waitlistform** project.
2. Go to **Settings** → **Environment Variables**.
3. Add (or update):

   | Name | Value | Environments |
   |------|--------|--------------|
   | `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | Your anon key from Supabase | Production, Preview, Development |

   Get both from **Supabase Dashboard** → **Settings** → **API** (Project URL and anon public key).

4. Save each variable.

---

## 3. Deploy (trigger a new build)

**Option A – From Git (recommended)**  
After step 1, Vercel will usually auto-deploy on push. If it didn’t:

- **Deployments** tab → **⋯** on the latest deployment → **Redeploy** (and check “Use existing Build Cache” or not, then confirm).

**Option B – From Vercel Dashboard**  
- **Deployments** → **Redeploy** on the latest deployment.

**Option C – Vercel CLI**  
From the project folder:

```bash
npx vercel --prod
```

(First time: `npx vercel login` and follow the prompts.)

---

## 4. Confirm it worked

- **Deployments**: Latest deployment should be **Ready** (green).
- **Build logs**: Should show “Environment variables injected successfully” and no errors.
- **Site**: Open your Vercel URL; form should load and submit to Supabase.

If the build fails with “SUPABASE_URL and SUPABASE_ANON_KEY must be set”, the env vars are missing or not set for the environment that’s building (add them for all three: Production, Preview, Development).
