// Supabase Configuration
// This file initializes the Supabase client for the waitlist form

// Supabase project configuration
// Environment variables are injected at build time by Vercel via build.js
// Placeholders {{SUPABASE_URL}} and {{SUPABASE_ANON_KEY}} are replaced during build
// Fallback values are defined in build.js for local development
// Using modern publishable key format (sb_publishable_...)
const SUPABASE_URL = 'https://dkgfuuenjbzsbtjiuhjn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZLrnZf-SImiW-5bdW1gOqA_ATYz8Pra';

// Initialize Supabase client
// The Supabase JS library from CDN (UMD build) exposes 'supabase' as a global
// We wait for it to load, then create the client using createClient
(function initSupabase() {
    function createClient() {
        // Check if Supabase library is loaded (UMD build exposes it as window.supabase)
        // Also check for alternative global names
        const supabaseLib = window.supabase || window.supabaseJs || window.Supabase;
        
        if (supabaseLib && typeof supabaseLib.createClient === 'function') {
            try {
                // Create and store the client globally
                // Verify the key is not empty
                if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.trim() === '') {
                    console.error('SUPABASE_ANON_KEY is empty or undefined!');
                    throw new Error('SUPABASE_ANON_KEY is required');
                }
                
                // Create client - Supabase JS automatically adds apikey header
                // The second parameter (SUPABASE_ANON_KEY) is automatically used as the apikey header
                const clientOptions = {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false
                    }
                };
                
                window.supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOptions);
                
                // Test the client by checking if it has the expected methods
                if (!window.supabaseClient || typeof window.supabaseClient.from !== 'function') {
                    throw new Error('Supabase client was not created correctly');
                }
                
                // Verify client was created
                if (!window.supabaseClient) {
                    throw new Error('Failed to create Supabase client');
                }
                
                console.log('Supabase client initialized successfully');
                
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
