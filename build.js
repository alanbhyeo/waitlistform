#!/usr/bin/env node

// Build script to inject environment variables into JavaScript files
const fs = require('fs');
const path = require('path');

// Get environment variables (Vercel provides these at build time)
// For local dev: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (or export them)
// Do not commit real keys; use Vercel env vars or .env (and add .env to .gitignore)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set.');
    console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel or in a .env file for local development.');
    process.exit(1);
}

console.log('Building with environment variables...');
console.log('Supabase URL:', SUPABASE_URL.substring(0, 30) + '...');
console.log('Supabase Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// File to process
const configFile = path.join(__dirname, 'supabase-config.js');

// Read the file
let content = fs.readFileSync(configFile, 'utf8');

// Replace placeholders with actual values
content = content.replace(/'{{SUPABASE_URL}}'/g, `'${SUPABASE_URL}'`);
content = content.replace(/'{{SUPABASE_ANON_KEY}}'/g, `'${SUPABASE_ANON_KEY}'`);

// Write back
fs.writeFileSync(configFile, content, 'utf8');

console.log('✓ Environment variables injected successfully');
