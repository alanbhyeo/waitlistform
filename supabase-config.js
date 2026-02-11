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
                
                // Verify the client has the correct configuration
                // Check if the client has the supabaseUrl property (some versions use different property names)
                console.log('Client properties:', Object.keys(window.supabaseClient));
                
                // Test a simple query to verify the client works
                // This will help us see if the API key is being sent
                window.supabaseClient.from('customer')
                    .select('count')
                    .limit(0)
                    .then(({ data, error }) => {
                        if (error && error.message && error.message.includes('API key')) {
                            console.error('API key issue detected:', error);
                        } else if (error) {
                            console.log('Client test query result (expected error for empty query):', error.message);
                        } else {
                            console.log('Client test successful - API key is working');
                        }
                    })
                    .catch(err => {
                        console.error('Client test failed:', err);
                    });
                
                // Verify client was created
                if (!window.supabaseClient) {
                    throw new Error('Failed to create Supabase client');
                }
                
                console.log('Supabase client initialized successfully');
                console.log('Using key format:', SUPABASE_ANON_KEY.startsWith('sb_publishable_') ? 'modern publishable' : 'legacy anon');
                console.log('Supabase URL:', SUPABASE_URL);
                console.log('Key length:', SUPABASE_ANON_KEY.length);
                console.log('Key preview:', SUPABASE_ANON_KEY.substring(0, 30) + '...');
                console.log('Client object:', window.supabaseClient);
                
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
