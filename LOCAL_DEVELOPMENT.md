# Local Development Guide

## Quick Start

### Option 1: Run Build Script (Recommended)
Before testing locally, run the build script to inject environment variables:

```bash
npm run build
```

Then open `form.html` in your browser.

### Option 2: Use a Local Server (Better for Testing)

For the best local development experience, use a local web server:

#### Using Python (if installed):
```bash
# Python 3
python3 -m http.server 8000

# Then open: http://localhost:8000/form.html
```

#### Using Node.js (if you have http-server installed):
```bash
npx http-server -p 8000

# Then open: http://localhost:8000/form.html
```

#### Using VS Code:
1. Install the "Live Server" extension
2. Right-click on `form.html`
3. Select "Open with Live Server"

## Why Use a Local Server?

When opening HTML files directly via `file://` protocol:
- Some browsers block CDN requests (CORS restrictions)
- Supabase library might not load properly
- Environment variables work better with HTTP protocol

## Troubleshooting

### "Configuration error. Please refresh the page."

This error appears if:
1. **Build script hasn't been run**: Run `npm run build` first
2. **Opening via file://**: Use a local server instead
3. **Supabase library not loading**: Check browser console for errors
4. **Network issues**: Ensure you have internet connection for CDN

### Check Browser Console

Open browser developer tools (F12) and check:
- Console tab for any errors
- Network tab to see if Supabase CDN is loading
- Look for "Supabase client initialized successfully" message

## Build Script

The build script (`build.js`) replaces placeholders in `supabase-config.js` with actual values:
- Uses environment variables if set
- Falls back to default values for local development
- Must be run before testing locally
