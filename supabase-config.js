// Supabase Configuration
// This file initializes the Supabase client for the waitlist form

// Supabase project configuration
// Environment variables are injected at build time by Vercel
// Fallback values are for local development
const SUPABASE_URL = 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZLrnZf-SImiW-5bdW1gOqA_ATYz8Pra';

// Initialize Supabase client
// The Supabase JS library from CDN (UMD build) exposes 'supabase' as a global
// We wait for it to load, then create the client using createClient
(function initSupabase() {
    function createClient() {
        // Check if Supabase library is loaded (UMD build exposes it as window.supabase)
        if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
            // Create and store the client globally
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
            return window.supabaseClient;
        } else {
            // Retry after a short delay if library hasn't loaded yet
            setTimeout(createClient, 50);
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createClient);
    } else {
        createClient();
    }
})();
