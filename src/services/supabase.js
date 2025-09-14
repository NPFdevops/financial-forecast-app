import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  throw new Error('Supabase configuration is missing');
}

if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

if (supabaseKey.length < 100) {
  console.error('Supabase key appears to be invalid (too short)');
  throw new Error('Invalid Supabase key format');
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // We don't need persistent auth sessions
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export configuration status
export const isSupabaseConfigured = true; // Always true if we get past the validation above

// Helper function to handle Supabase errors with better error messages
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase operation failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    // Provide user-friendly error messages
    if (error.code === 'PGRST116') {
      throw new Error('Database table not found. Please ensure the database schema is properly installed.');
    } else if (error.message?.includes('JWT')) {
      throw new Error('Authentication error. Please check your Supabase configuration.');
    } else if (error.message?.includes('Invalid API key')) {
      throw new Error('Invalid API key. Please verify your Supabase anon key.');
    } else {
      throw new Error(error.message || 'Database operation failed');
    }
  }
};

// Helper function for consistent error handling in async operations
export const withErrorHandling = async (operation) => {
  try {
    const result = await operation();
    if (result && result.error) {
      handleSupabaseError(result.error);
    }
    return result;
  } catch (error) {
    if (error.message) {
      // Re-throw known errors
      throw error;
    } else {
      // Handle unexpected errors
      console.error('Unexpected error during database operation:', error);
      throw new Error('An unexpected database error occurred');
    }
  }
};
