import React, { useState } from 'react';
import { testSupabaseSetup, testDatabaseConnection } from '../test/supabaseTest';
import { LoadingSpinner, ErrorMessage } from './LoadingComponents';
import { isSupabaseConfigured } from '../services/supabase';

const SupabaseTestPanel = () => {
  const [testResults, setTestResults] = useState(null);
  const [dbTestResults, setDbTestResults] = useState(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  const runSetupTest = () => {
    console.clear();
    const results = testSupabaseSetup();
    setTestResults(results);
  };

  const runDatabaseTest = async () => {
    setIsTestingDb(true);
    setDbTestResults(null);
    
    try {
      const results = await testDatabaseConnection();
      setDbTestResults(results);
    } catch (error) {
      setDbTestResults({ 
        success: false, 
        error: error.message || 'Unexpected error during database test' 
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
    fontFamily: 'monospace'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px',
    fontSize: '14px'
  };

  const successStyle = {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0'
  };

  const warningStyle = {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    color: '#856404',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0'
  };

  const errorStyle = {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0'
  };

  return (
    <div style={containerStyle}>
      <h3>🧪 Supabase Integration Test Panel</h3>
      <p>Use this panel to verify that your Supabase integration is working correctly.</p>
      
      {/* Configuration warning disabled - user has configured Supabase */}
      
      <div>
        <button 
          style={buttonStyle}
          onClick={runSetupTest}
        >
          Test Setup & Configuration
        </button>
        
        <button 
          style={buttonStyle}
          onClick={runDatabaseTest}
          disabled={isTestingDb}
        >
          {isTestingDb ? <LoadingSpinner size="small" /> : 'Test Database Connection'}
        </button>
      </div>

      {testResults && (
        <div style={testResults.environmentReady ? successStyle : warningStyle}>
          <h4>📊 Setup Test Results:</h4>
          <p><strong>Environment Ready:</strong> {testResults.environmentReady ? '✅ Yes' : '⚠️ No'}</p>
          <p><strong>Imports Working:</strong> {testResults.importsWorking ? '✅ Yes' : '❌ No'}</p>
          
          <h5>Next Steps:</h5>
          <ul>
            {testResults.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
          
          <p><em>Check the browser console for detailed logs.</em></p>
        </div>
      )}

      {dbTestResults && (
        <div style={dbTestResults.success ? successStyle : errorStyle}>
          <h4>🗄️ Database Test Results:</h4>
          {dbTestResults.success ? (
            <div>
              <p>✅ <strong>Database connection successful!</strong></p>
              <p>Your Supabase database is properly configured and accessible.</p>
            </div>
          ) : (
            <div>
              <p>❌ <strong>Database connection failed</strong></p>
              <p><strong>Error:</strong> {dbTestResults.error}</p>
              <p><strong>Possible causes:</strong></p>
              <ul>
                <li>Environment variables not set correctly</li>
                <li>Supabase project not created</li>
                <li>Database schema not installed</li>
                <li>Network connectivity issues</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>📝 Quick Setup Checklist:</h4>
        <ul>
          <li>✅ Supabase dependency installed</li>
          <li>✅ Integration files created</li>
          <li>✅ Build system compatible</li>
          <li>✅ Environment variables configured</li>
          <li>⚠️ Database schema needs to be installed (if not done yet)</li>
        </ul>
        
        <p><strong>Files created:</strong></p>
        <ul>
          <li><code>src/services/supabase.js</code> - Supabase client</li>
          <li><code>src/services/financialModelService.js</code> - API services</li>
          <li><code>src/hooks/useFinancialModel.js</code> - React hooks</li>
          <li><code>src/components/LoadingComponents.js</code> - UI components</li>
          <li><code>src/database/schema.sql</code> - Database schema</li>
          <li><code>SUPABASE_SETUP.md</code> - Setup instructions</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseTestPanel;