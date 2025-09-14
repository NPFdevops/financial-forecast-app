import { supabase } from './supabase.js';

// Check if database is properly initialized
export const checkDatabaseHealth = async () => {
  try {
    // Test 1: Check if scenarios table exists and has data
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('count', { count: 'exact', head: true });
    
    if (scenariosError) {
      throw new Error(`Scenarios table check failed: ${scenariosError.message}`);
    }

    // Test 2: Check if base_assumptions table has data
    const { data: assumptions, error: assumptionsError } = await supabase
      .from('base_assumptions')
      .select('count', { count: 'exact', head: true });
    
    if (assumptionsError) {
      throw new Error(`Base assumptions table check failed: ${assumptionsError.message}`);
    }

    // Test 3: Check if scenario_multipliers table has data
    const { data: multipliers, error: multipliersError } = await supabase
      .from('scenario_multipliers')
      .select('count', { count: 'exact', head: true });
    
    if (multipliersError) {
      throw new Error(`Scenario multipliers table check failed: ${multipliersError.message}`);
    }

    return {
      healthy: true,
      tables: {
        scenarios: scenarios || 0,
        base_assumptions: assumptions || 0,
        scenario_multipliers: multipliers || 0
      }
    };

  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
};

// Initialize database with default data if needed
export const initializeDatabase = async () => {
  try {
    const healthCheck = await checkDatabaseHealth();
    
    if (healthCheck.healthy) {
      console.log('✅ Database is healthy and contains data');
      return healthCheck;
    } else {
      console.error('❌ Database health check failed:', healthCheck.error);
      
      // Check if this is a schema issue
      if (healthCheck.error.includes('table') || healthCheck.error.includes('PGRST116')) {
        throw new Error('Database schema not found. Please run the schema SQL in your Supabase dashboard.');
      } else {
        throw new Error(`Database initialization failed: ${healthCheck.error}`);
      }
    }
    
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Get database status for UI display
export const getDatabaseStatus = async () => {
  try {
    const health = await checkDatabaseHealth();
    
    if (health.healthy) {
      return {
        status: 'connected',
        message: 'Database connected and ready',
        details: health.tables
      };
    } else {
      return {
        status: 'error',
        message: health.error,
        needsSchema: health.error.includes('table') || health.error.includes('PGRST116')
      };
    }
    
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Database connection failed'
    };
  }
};