import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if we're in a deployment environment without proper config
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidConfig = supabaseUrl && supabaseKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') && 
  supabaseKey.length > 100;

// In production/deployment, provide fallback values to prevent app crash
let finalUrl = supabaseUrl;
let finalKey = supabaseKey;

if (!hasValidConfig) {
  if (isDevelopment) {
    console.error('Missing or invalid Supabase configuration.');
    console.error('Please check your .env file and ensure:');
    console.error('1. REACT_APP_SUPABASE_URL is set to your Supabase project URL');
    console.error('2. REACT_APP_SUPABASE_ANON_KEY is set to your anon key');
    throw new Error('Supabase configuration is missing or invalid');
  } else {
    // In production, use fallback values to prevent complete app crash
    console.warn('⚠️ Supabase configuration missing in production. Using fallback values.');
    finalUrl = 'https://placeholder.supabase.co';
    finalKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU5OTI4ODAsImV4cCI6MTk2MTU2ODg4MH0.fallback';
  }
}

// Create Supabase client with proper configuration
export const supabase = createClient(finalUrl, finalKey, {
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
export const isSupabaseConfigured = hasValidConfig;

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
