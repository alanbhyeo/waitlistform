#!/usr/bin/env node

// Build script to inject environment variables into JavaScript files
const fs = require('fs');
const path = require('path');

// Get environment variables (Vercel provides these)
// Fallback values for local development
// NOTE: Using legacy anon key for compatibility - modern publishable keys may not be fully supported by Supabase JS yet
// Legacy anon key format (JWT) is more widely supported
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ2Z1dWVuamJ6c2J0aml1aGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTE3MTYsImV4cCI6MjA4NjMyNzcxNn0.p1_3JFUWdfi-Draw4BEeZJ4JDozn4mp5hyU9PtWfqBg';

// Validate that we have the required values
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
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
