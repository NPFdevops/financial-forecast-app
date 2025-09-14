// Migration script to help move existing hardcoded data to Supabase
// Run this script to get the SQL INSERT statements for your existing data

import { scenarios, scenarioMultipliers, baseAssumptions } from '../data/financialModel.js';

// Helper to generate SQL INSERT statements
const generateInsertStatements = () => {
  console.log('='.repeat(80));
  console.log('FINANCIAL MODEL DATA MIGRATION');
  console.log('='.repeat(80));
  console.log('Copy and paste these SQL statements into your Supabase SQL editor');
  console.log('');

  // 1. Scenarios (already handled in schema.sql)
  console.log('-- 1. Scenarios already inserted in schema.sql');
  console.log('');

  // 2. Scenario Multipliers
  console.log('-- 2. Scenario Multipliers (verify these match your schema.sql)');
  const scenarioMap = { base: 1, upside: 2, downside: 3 };
  
  Object.entries(scenarioMultipliers).forEach(([multiplierKey, scenarios]) => {
    Object.entries(scenarios).forEach(([scenarioName, value]) => {
      const scenarioId = scenarioMap[scenarioName];
      const multiplierType = multiplierKey.replace(/([A-Z])/g, '_$1').toLowerCase();
      console.log(`INSERT INTO scenario_multipliers (scenario_id, multiplier_type, value) VALUES (${scenarioId}, '${multiplierType}', ${value});`);
    });
  });
  console.log('');

  // 3. Base Assumptions
  console.log('-- 3. Base Assumptions');
  Object.entries(baseAssumptions).forEach(([assumptionKey, yearData]) => {
    if (typeof yearData === 'object' && yearData !== null && !Array.isArray(yearData)) {
      // Handle nested objects like b2bClients, b2bPricing, costs, headcount, salaries
      if (['b2bClients', 'b2bPricing'].includes(assumptionKey)) {
        // These are handled in separate tables
        return;
      }
      
      if (assumptionKey === 'costs') {
        // Handle costs separately
        Object.entries(yearData).forEach(([costType, values]) => {
          Object.entries(values).forEach(([year, amount]) => {
            console.log(`INSERT INTO costs (cost_type, year, amount, unit, description) VALUES ('${costType.toLowerCase()}', ${year}, ${amount}, 'USD_monthly', '${costType} cost');`);
          });
        });
        return;
      }
      
      if (assumptionKey === 'headcount') {
        // Handle headcount separately - these go in headcount table
        Object.entries(yearData).forEach(([role, values]) => {
          Object.entries(values).forEach(([year, count]) => {
            const roleNameDb = role.replace(/([A-Z])/g, '_$1').toLowerCase();
            console.log(`-- Headcount for ${role}: INSERT INTO headcount (role_id, year, count) VALUES ((SELECT id FROM employee_roles WHERE role_name = '${roleNameDb}'), ${year}, ${count});`);
          });
        });
        return;
      }
      
      if (assumptionKey === 'salariesMonthly') {
        // Handle salaries separately
        Object.entries(yearData).forEach(([role, values]) => {
          Object.entries(values).forEach(([year, salary]) => {
            const roleNameDb = role.replace(/([A-Z])/g, '_$1').toLowerCase();
            console.log(`-- Salary for ${role}: INSERT INTO salaries (role_id, year, monthly_salary) VALUES ((SELECT id FROM employee_roles WHERE role_name = '${roleNameDb}'), ${year}, ${salary});`);
          });
        });
        return;
      }
      
      if (assumptionKey === 'cashFlow') {
        // Handle cash flow separately  
        Object.entries(yearData).forEach(([metric, value]) => {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([year, amount]) => {
              const metricType = metric.replace(/([A-Z])/g, '_$1').toLowerCase();
              console.log(`INSERT INTO cash_flow (metric_type, year, amount, description) VALUES ('${metricType}', ${year}, ${amount}, '${metric}');`);
            });
          } else {
            const metricType = metric.replace(/([A-Z])/g, '_$1').toLowerCase();
            console.log(`INSERT INTO cash_flow (metric_type, year, amount, description) VALUES ('${metricType}', NULL, ${value}, '${metric}');`);
          }
        });
        return;
      }
      
      // Handle regular nested year data (like traffic sessions, etc.)
      Object.entries(yearData).forEach(([year, value]) => {
        const assumptionType = assumptionKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        const unit = getUnitForAssumption(assumptionKey);
        const description = getDescriptionForAssumption(assumptionKey);
        console.log(`INSERT INTO base_assumptions (assumption_type, year, value, unit, description) VALUES ('${assumptionType}', ${year}, ${value}, '${unit}', '${description}');`);
      });
    }
  });
  console.log('');

  // 4. B2B Data
  console.log('-- 4. B2B Client Data');
  Object.entries(baseAssumptions.b2bClients).forEach(([tier, yearData]) => {
    Object.entries(yearData).forEach(([year, count]) => {
      console.log(`INSERT INTO b2b_clients (tier_id, year, client_count) VALUES ((SELECT id FROM b2b_tiers WHERE tier_name = '${tier.toLowerCase()}'), ${year}, ${count});`);
    });
  });
  console.log('');

  console.log('-- 5. B2B Pricing Data');
  Object.entries(baseAssumptions.b2bPricing).forEach(([tier, yearData]) => {
    Object.entries(yearData).forEach(([year, price]) => {
      console.log(`INSERT INTO b2b_pricing (tier_id, year, annual_price) VALUES ((SELECT id FROM b2b_tiers WHERE tier_name = '${tier.toLowerCase()}'), ${year}, ${price});`);
    });
  });
  console.log('');

  console.log('='.repeat(80));
  console.log('MIGRATION COMPLETE');
  console.log('='.repeat(80));
  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Create a new Supabase project at https://supabase.com');
  console.log('2. Copy your project URL and anon key to the .env file');
  console.log('3. Run the schema.sql file in your Supabase SQL editor');
  console.log('4. The data should already be inserted from the schema file');
  console.log('5. Update your React components to use the new database service');
};

// Helper functions
const getUnitForAssumption = (key) => {
  const unitMap = {
    'globalNftMarketVolume': 'USD',
    'trafficSessions': 'sessions',
    'walletConnectionRate': 'rate',
    'paidConversionRate': 'rate',
    'avgFee': 'USD',
    'b2cArpu': 'USD',
    'churnMonthly': 'rate'
  };
  return unitMap[key] || 'value';
};

const getDescriptionForAssumption = (key) => {
  const descriptionMap = {
    'globalNftMarketVolume': 'Global NFT market volume',
    'trafficSessions': 'Monthly traffic sessions',
    'walletConnectionRate': 'Rate of users connecting wallets',
    'paidConversionRate': 'Rate of users converting to paid',
    'avgFee': 'Average fee per transaction',
    'b2cArpu': 'B2C Annual Revenue Per User',
    'churnMonthly': 'Monthly churn rate'
  };
  return descriptionMap[key] || key;
};

// Export for use in Node.js environment or browser console
export { generateInsertStatements };

// If running in Node.js, execute immediately
if (typeof window === 'undefined') {
  generateInsertStatements();
}

// You can also create a simple verification function
export const verifyData = async () => {
  console.log('Original financial model data structure:');
  console.log('Scenarios:', Object.keys(scenarios));
  console.log('Scenario multipliers:', Object.keys(scenarioMultipliers));
  console.log('Base assumptions:', Object.keys(baseAssumptions));
  console.log('');
  
  // Show sample data structure
  console.log('Sample base assumptions structure:');
  console.log('Traffic Sessions:', baseAssumptions.trafficSessions);
  console.log('B2C ARPU:', baseAssumptions.b2cArpu);
  console.log('B2B Clients (Tier D):', baseAssumptions.b2bClients.tierD);
  console.log('Costs (Marketing):', baseAssumptions.costs.marketingSpend);
  console.log('Headcount (Engineering):', baseAssumptions.headcount.engineering);
  console.log('Salaries (Engineering):', baseAssumptions.salariesMonthly.engineering);
  console.log('Cash Flow:', baseAssumptions.cashFlow);
};