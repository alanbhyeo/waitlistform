// Supabase Configuration
// This file initializes the Supabase client for the waitlist form

// Supabase project configuration
// Environment variables are injected at build time by Vercel
// Fallback values are for local development
// NOTE: Using legacy anon key for compatibility - modern publishable keys may not be fully supported yet
const SUPABASE_URL = 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ2Z1dWVuamJ6c2J0aml1aGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTE3MTYsImV4cCI6MjA4NjMyNzcxNn0.p1_3JFUWdfi-Draw4BEeZJ4JDozn4mp5hyU9PtWfqBg';

// Initialize Supabase client
// The Supabase JS library from CDN (UMD build) exposes 'supabase' as a global
// We wait for it to load, then create the client using createClient
(function initSupabase() {
    function createClient() {
        // Check if Supabase library is loaded (UMD build exposes it as window.supabase)
        if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
            try {
                // Create and store the client globally
                // Modern publishable keys work the same way as legacy keys in Supabase JS v2.39.3+
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false
                    }
                });
                console.log('Supabase client initialized successfully');
                console.log('Using key format:', SUPABASE_ANON_KEY.startsWith('sb_publishable_') ? 'modern publishable' : 'legacy anon');
                console.log('Supabase URL:', SUPABASE_URL);
                console.log('Key preview:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
                return window.supabaseClient;
            } catch (error) {
                console.error('Error creating Supabase client:', error);
                // Retry after a delay
                setTimeout(createClient, 100);
            }
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
