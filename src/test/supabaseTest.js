// Test file to verify Supabase integration
// This file tests the basic setup and imports

import { supabase } from '../services/supabase.js';
import { 
  financialModelService,
  scenarioService,
  assumptionsService,
  calculateFinancials
} from '../services/financialModelService.js';

import {
  useFinancialModel,
  useScenarioData,
  useEditableAssumptions,
  useFinancialFormatters
} from '../hooks/useFinancialModel.js';

// Test configuration
export const testSupabaseSetup = () => {
  console.log('🧪 Testing Supabase Setup...');
  
  // Check if environment variables are set
  const hasUrl = process.env.REACT_APP_SUPABASE_URL && 
                 process.env.REACT_APP_SUPABASE_URL !== 'your_supabase_project_url_here';
  const hasKey = process.env.REACT_APP_SUPABASE_ANON_KEY && 
                 process.env.REACT_APP_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here';

  console.log('📊 Environment Check:');
  console.log(`  ✅ REACT_APP_SUPABASE_URL: ${hasUrl ? 'Set' : '❌ Not set (still placeholder)'}`);
  console.log(`  ✅ REACT_APP_SUPABASE_ANON_KEY: ${hasKey ? 'Set' : '❌ Not set (still placeholder)'}`);
  
  // Test imports
  console.log('📦 Import Check:');
  console.log(`  ✅ supabase client: ${supabase ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ financialModelService: ${financialModelService ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ scenarioService: ${scenarioService ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ assumptionsService: ${assumptionsService ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ calculateFinancials: ${calculateFinancials ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ useFinancialModel: ${useFinancialModel ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ useScenarioData: ${useScenarioData ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ useEditableAssumptions: ${useEditableAssumptions ? 'OK' : '❌ Failed'}`);
  console.log(`  ✅ useFinancialFormatters: ${useFinancialFormatters ? 'OK' : '❌ Failed'}`);

  // Test if Supabase client is properly initialized
  console.log('🔌 Supabase Client Check:');
  try {
    if (hasUrl && hasKey) {
      console.log('  ✅ Client initialized with real credentials');
      console.log(`  📡 URL: ${process.env.REACT_APP_SUPABASE_URL}`);
      console.log(`  🔑 Key: ${process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 20)}...`);
    } else {
      console.log('  ⚠️  Client initialized with placeholder credentials');
      console.log('  📝 Action needed: Update .env file with real Supabase credentials');
    }
  } catch (error) {
    console.log(`  ❌ Client initialization error: ${error.message}`);
  }

  return {
    environmentReady: hasUrl && hasKey,
    importsWorking: true,
    nextSteps: !hasUrl || !hasKey ? [
      '1. Create Supabase project at https://supabase.com',
      '2. Update .env with your project URL and anon key',
      '3. Run the schema.sql file in Supabase SQL Editor',
      '4. Restart your development server'
    ] : [
      '1. Run schema.sql in Supabase SQL Editor if not done yet',
      '2. Update your components to use the new hooks',
      '3. Test the database connection'
    ]
  };
};

// Function to test database connection (only works with real credentials)
export const testDatabaseConnection = async () => {
  console.log('🗄️  Testing Database Connection...');
  
  try {
    // Simple test query
    const { data, error } = await supabase
      .from('scenarios')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found scenarios table`);
    return { success: true, data };

  } catch (error) {
    console.log('❌ Database test error:', error.message);
    return { success: false, error: error.message };
  }
};

// Export for use in components
export default testSupabaseSetup;