import { supabase, withErrorHandling } from './supabase.js';

// ============================================================================
// SCENARIOS API
// ============================================================================

export const scenarioService = {
  // Get all scenarios
  getAll: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    });
  },

  // Get scenario multipliers for a specific scenario
  getMultipliers: async (scenarioId) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('scenario_multipliers')
        .select('*')
        .eq('scenario_id', scenarioId);
      
      if (error) throw error;
      
      // Convert to object format for easier use
      const multipliers = {};
      data.forEach(item => {
        multipliers[item.multiplier_type] = item.value;
      });
      return multipliers;
    });
  },

  // Update scenario multiplier
  updateMultiplier: async (scenarioId, multiplierType, value) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('scenario_multipliers')
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq('scenario_id', scenarioId)
        .eq('multiplier_type', multiplierType)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// BASE ASSUMPTIONS API
// ============================================================================

export const assumptionsService = {
  // Get all base assumptions
  getAll: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('base_assumptions')
        .select('*')
        .order('assumption_type, year');
      
      if (error) throw error;
      
      // Convert to nested object format for easier use
      const assumptions = {};
      data.forEach(item => {
        if (!assumptions[item.assumption_type]) {
          assumptions[item.assumption_type] = {};
        }
        assumptions[item.assumption_type][item.year] = item.value;
      });
      return assumptions;
    });
  },

  // Get assumptions by type
  getByType: async (assumptionType) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('base_assumptions')
        .select('*')
        .eq('assumption_type', assumptionType)
        .order('year');
      
      if (error) throw error;
      
      const result = {};
      data.forEach(item => {
        result[item.year] = item.value;
      });
      return result;
    });
  },

  // Update assumption value
  updateAssumption: async (assumptionType, year, value) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('base_assumptions')
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq('assumption_type', assumptionType)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// B2B CLIENTS AND PRICING API
// ============================================================================

export const b2bService = {
  // Get all tiers
  getTiers: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('b2b_tiers')
        .select('*')
        .order('tier_order');
      
      if (error) throw error;
      return data;
    });
  },

  // Get B2B client data
  getClients: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('b2b_clients')
        .select(`
          *,
          b2b_tiers!inner(tier_name, tier_order)
        `)
        .order('year');
      
      if (error) throw error;
      
      // Convert to nested object format
      const clients = {};
      data.forEach(item => {
        const tierName = item.b2b_tiers.tier_name;
        if (!clients[tierName]) {
          clients[tierName] = {};
        }
        clients[tierName][item.year] = item.client_count;
      });
      return clients;
    });
  },

  // Get B2B pricing data  
  getPricing: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('b2b_pricing')
        .select(`
          *,
          b2b_tiers!inner(tier_name, tier_order)
        `)
        .order('year');
      
      if (error) throw error;
      
      // Convert to nested object format
      const pricing = {};
      data.forEach(item => {
        const tierName = item.b2b_tiers.tier_name;
        if (!pricing[tierName]) {
          pricing[tierName] = {};
        }
        pricing[tierName][item.year] = parseFloat(item.annual_price);
      });
      return pricing;
    });
  },

  // Update client count for a tier/year
  updateClientCount: async (tierName, year, clientCount) => {
    return withErrorHandling(async () => {
      // First get the tier ID
      const { data: tiers, error: tierError } = await supabase
        .from('b2b_tiers')
        .select('id')
        .eq('tier_name', tierName)
        .single();
      
      if (tierError) throw tierError;
      
      const { data, error } = await supabase
        .from('b2b_clients')
        .update({ 
          client_count: clientCount, 
          updated_at: new Date().toISOString() 
        })
        .eq('tier_id', tiers.id)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  },

  // Update pricing for a tier/year
  updatePricing: async (tierName, year, annualPrice) => {
    return withErrorHandling(async () => {
      // First get the tier ID
      const { data: tiers, error: tierError } = await supabase
        .from('b2b_tiers')
        .select('id')
        .eq('tier_name', tierName)
        .single();
      
      if (tierError) throw tierError;
      
      const { data, error } = await supabase
        .from('b2b_pricing')
        .update({ 
          annual_price: annualPrice, 
          updated_at: new Date().toISOString() 
        })
        .eq('tier_id', tiers.id)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// COSTS API
// ============================================================================

export const costsService = {
  // Get all costs
  getAll: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('costs')
        .select('*')
        .order('cost_type, year');
      
      if (error) throw error;
      
      // Convert to nested object format
      const costs = {};
      data.forEach(item => {
        if (!costs[item.cost_type]) {
          costs[item.cost_type] = {};
        }
        costs[item.cost_type][item.year] = parseFloat(item.amount);
      });
      return costs;
    });
  },

  // Update cost amount
  updateCost: async (costType, year, amount) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('costs')
        .update({ 
          amount, 
          updated_at: new Date().toISOString() 
        })
        .eq('cost_type', costType)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// HEADCOUNT AND SALARIES API
// ============================================================================

export const headcountService = {
  // Get all employee roles
  getRoles: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('employee_roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      return data;
    });
  },

  // Get headcount data
  getHeadcount: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('headcount')
        .select(`
          *,
          employee_roles!inner(role_name)
        `)
        .order('year');
      
      if (error) throw error;
      
      // Convert to nested object format
      const headcount = {};
      data.forEach(item => {
        const roleName = item.employee_roles.role_name;
        if (!headcount[roleName]) {
          headcount[roleName] = {};
        }
        headcount[roleName][item.year] = item.count;
      });
      return headcount;
    });
  },

  // Get salary data
  getSalaries: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('salaries')
        .select(`
          *,
          employee_roles!inner(role_name)
        `)
        .order('year');
      
      if (error) throw error;
      
      // Convert to nested object format
      const salaries = {};
      data.forEach(item => {
        const roleName = item.employee_roles.role_name;
        if (!salaries[roleName]) {
          salaries[roleName] = {};
        }
        salaries[roleName][item.year] = parseFloat(item.monthly_salary);
      });
      return salaries;
    });
  },

  // Update headcount
  updateHeadcount: async (roleName, year, count) => {
    return withErrorHandling(async () => {
      // First get the role ID
      const { data: roles, error: roleError } = await supabase
        .from('employee_roles')
        .select('id')
        .eq('role_name', roleName)
        .single();
      
      if (roleError) throw roleError;
      
      const { data, error } = await supabase
        .from('headcount')
        .update({ 
          count, 
          updated_at: new Date().toISOString() 
        })
        .eq('role_id', roles.id)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  },

  // Update salary
  updateSalary: async (roleName, year, monthlySalary) => {
    return withErrorHandling(async () => {
      // First get the role ID
      const { data: roles, error: roleError } = await supabase
        .from('employee_roles')
        .select('id')
        .eq('role_name', roleName)
        .single();
      
      if (roleError) throw roleError;
      
      const { data, error } = await supabase
        .from('salaries')
        .update({ 
          monthly_salary: monthlySalary, 
          updated_at: new Date().toISOString() 
        })
        .eq('role_id', roles.id)
        .eq('year', year)
        .select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// CASH FLOW API
// ============================================================================

export const cashFlowService = {
  // Get all cash flow data
  getAll: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('cash_flow')
        .select('*')
        .order('metric_type, year');
      
      if (error) throw error;
      
      // Convert to structured format similar to original
      const cashFlow = {
        startingCash: 0,
        equityRaises: 0,
        yearEndCash: {},
        plannedRaises: {}
      };
      
      data.forEach(item => {
        const amount = parseFloat(item.amount);
        
        switch(item.metric_type) {
          case 'starting_cash':
            cashFlow.startingCash = amount;
            break;
          case 'equity_raises':
            cashFlow.equityRaises = amount;
            break;
          case 'year_end_cash':
            cashFlow.yearEndCash[item.year] = amount;
            break;
          case 'planned_raises':
            cashFlow.plannedRaises[item.year] = amount;
            break;
          default:
            console.warn(`Unknown cash flow metric type: ${item.metric_type}`);
            break;
        }
      });
      
      return cashFlow;
    });
  },

  // Update cash flow metric
  updateMetric: async (metricType, year, amount) => {
    return withErrorHandling(async () => {
      const updateData = { 
        amount, 
        updated_at: new Date().toISOString() 
      };
      
      let query = supabase
        .from('cash_flow')
        .update(updateData)
        .eq('metric_type', metricType);
      
      // Add year condition if provided
      if (year !== null && year !== undefined) {
        query = query.eq('year', year);
      } else {
        query = query.is('year', null);
      }
      
      const { data, error } = await query.select();
      
      if (error) throw error;
      return data[0];
    });
  }
};

// ============================================================================
// COMPREHENSIVE FINANCIAL MODEL API
// ============================================================================

export const financialModelService = {
  // Load all financial model data at once
  loadAll: async () => {
    return withErrorHandling(async () => {
      const [
        scenarios,
        baseAssumptions,
        b2bClients,
        b2bPricing,
        costs,
        headcount,
        salaries,
        cashFlow
      ] = await Promise.all([
        scenarioService.getAll(),
        assumptionsService.getAll(),
        b2bService.getClients(),
        b2bService.getPricing(),
        costsService.getAll(),
        headcountService.getHeadcount(),
        headcountService.getSalaries(),
        cashFlowService.getAll()
      ]);

      return {
        scenarios,
        baseAssumptions,
        b2bClients,
        b2bPricing,
        costs,
        headcount,
        salaries,
        cashFlow
      };
    });
  },

  // Load scenario-specific data including multipliers
  loadScenario: async (scenarioId) => {
    return withErrorHandling(async () => {
      const [modelData, multipliers] = await Promise.all([
        financialModelService.loadAll(),
        scenarioService.getMultipliers(scenarioId)
      ]);

      return {
        ...modelData,
        multipliers
      };
    });
  }
};

// ============================================================================
// CALCULATION HELPERS (moved from original financialModel.js)
// ============================================================================

// Calculate financial metrics based on scenario - now uses database data
export const calculateFinancials = async (scenarioName = 'Base') => {
  try {
    // Get scenario ID from name
    const scenarios = await scenarioService.getAll();
    const scenario = scenarios.find(s => s.name.toLowerCase() === scenarioName.toLowerCase());
    
    if (!scenario) {
      throw new Error(`Scenario "${scenarioName}" not found`);
    }

    // Load all data for calculation
    const { baseAssumptions, b2bClients, b2bPricing, costs, headcount, salaries, multipliers } = 
      await financialModelService.loadScenario(scenario.id);

    const results = {};
    
    [2026, 2027, 2028].forEach(year => {
      // Apply multipliers to base assumptions
      const adjustedTraffic = (baseAssumptions.traffic_sessions?.[year] || 0) * 
        (multipliers.traffic_multiplier || 1);
      const adjustedConversionRate = (baseAssumptions.paid_conversion_rate?.[year] || 0) * 
        (multipliers.paid_conversion_multiplier || 1);
      const adjustedArpu = (baseAssumptions.b2c_arpu?.[year] || 0) * 
        (multipliers.b2c_arpu_multiplier || 1);
      
      // B2C Revenue calculation
      const globalNftMarketVolume = baseAssumptions.global_nft_market_volume?.[year] || 0;
      const avgFee = baseAssumptions.avg_fee?.[year] || 0;
      const marketShare = adjustedConversionRate; // Renaming for clarity

      const b2cRevenue = globalNftMarketVolume * marketShare * avgFee;

      // Recalculate active paid users based on new B2C revenue and ARPU for reporting
      const annualArpu = adjustedArpu * 12;
      const activePaidUsers = annualArpu > 0 ? b2cRevenue / annualArpu : 0;
      
      // B2B Revenue calculation
      let b2bRevenue = 0;
      Object.keys(b2bClients).forEach(tier => {
        const clients = (b2bClients[tier]?.[year] || 0) * (multipliers.b2b_clients_multiplier || 1);
        const pricing = (b2bPricing[tier]?.[year] || 0) * (multipliers.b2b_price_multiplier || 1);
        b2bRevenue += clients * pricing * 12; // Annual
      });
      
      const totalRevenue = b2cRevenue + b2bRevenue;
      
      // Costs calculation
      const hostingCost = (costs.hosting_cost_per_user?.[year] || 0) * 
        (multipliers.hosting_cost_multiplier || 1) * 12;
      const grossMargin = totalRevenue - hostingCost;
      
      // Operating expenses
      let totalSalaries = 0;
      Object.keys(headcount).forEach(role => {
        const headcountCount = headcount[role]?.[year] || 0;
        const salary = salaries[role]?.[year] || 0;
        totalSalaries += headcountCount * salary * 12;
      });
      
      const marketingCost = (costs.marketing_spend?.[year] || 0) * 
        (multipliers.marketing_spend_multiplier || 1) * 12;
      const gaCost = (costs.ga_fixed?.[year] || 0) * 
        (multipliers.ga_multiplier || 1) * 12;
      
      const totalOpex = totalSalaries + marketingCost + gaCost;
      const ebitda = grossMargin - totalOpex;
      
      results[year] = {
        activePaidUsers: Math.round(activePaidUsers),
        b2cRevenue: Math.round(b2cRevenue),
        b2bRevenue: Math.round(b2bRevenue),
        totalRevenue: Math.round(totalRevenue),
        hostingCost: Math.round(hostingCost),
        grossMargin: Math.round(grossMargin),
        salaries: Math.round(totalSalaries),
        marketing: Math.round(marketingCost),
        ga: Math.round(gaCost),
        totalOpex: Math.round(totalOpex),
        ebitda: Math.round(ebitda)
      };
    });
    
    return results;
  } catch (error) {
    console.error('Error calculating financials:', error);
    throw error;
  }
};