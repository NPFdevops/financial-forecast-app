import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  financialModelService, 
  scenarioService, 
  assumptionsService,
  b2bService,
  costsService,
  headcountService,
  cashFlowService,
  calculateFinancials
} from '../services/financialModelService';
import { initializeDatabase } from '../services/databaseInit';

// ============================================================================
// MAIN FINANCIAL MODEL HOOK
// ============================================================================

export const useFinancialModel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load all financial model data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const modelData = await financialModelService.loadAll();
      setData(modelData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading financial model data:', err);
      setError(err.message || 'Failed to load financial model data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh data
  const refresh = useCallback(() => {
    return loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
};

// ============================================================================
// SCENARIO-SPECIFIC HOOK
// ============================================================================

export const useScenarioData = (scenarioName = 'Base') => {
  const [data, setData] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [calculationsLoading, setCalculationsLoading] = useState(false);

  // Load scenario-specific data
  const loadScenarioData = useCallback(async (scenarioName) => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database and check health
      await initializeDatabase();
      
      // First get all scenarios
      const scenarioList = await scenarioService.getAll();
      setScenarios(scenarioList);
      
      // Find the requested scenario
      const scenario = scenarioList.find(s => s.name === scenarioName);
      if (!scenario) {
        throw new Error(`Scenario "${scenarioName}" not found`);
      }
      
      // Load scenario-specific data
      const scenarioData = await financialModelService.loadScenario(scenario.id);
      setData(scenarioData);
      
    } catch (err) {
      console.error('Error loading scenario data:', err);
      setError(err.message || 'Failed to load scenario data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate financials for current scenario
  const calculateScenarioFinancials = useCallback(async () => {
    if (!scenarioName) return;
    
    try {
      setCalculationsLoading(true);
      const results = await calculateFinancials(scenarioName);
      setCalculations(results);
    } catch (err) {
      console.error('Error calculating financials:', err);
      setError(err.message || 'Failed to calculate financials');
    } finally {
      setCalculationsLoading(false);
    }
  }, [scenarioName]);

  // Load data when scenario changes
  useEffect(() => {
    loadScenarioData(scenarioName);
  }, [loadScenarioData, scenarioName]);

  // Calculate financials when data changes
  useEffect(() => {
    if (data && !loading) {
      calculateScenarioFinancials();
    }
  }, [data, loading, calculateScenarioFinancials]);

  // Switch to different scenario
  const switchScenario = useCallback((newScenarioName) => {
    loadScenarioData(newScenarioName);
  }, [loadScenarioData]);

  return {
    data,
    scenarios,
    loading,
    error,
    calculations,
    calculationsLoading,
    switchScenario,
    refresh: () => loadScenarioData(scenarioName)
  };
};

// ============================================================================
// EDITABLE DATA HOOKS
// ============================================================================

export const useEditableAssumptions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAssumption = useCallback(async (assumptionType, year, value) => {
    try {
      setLoading(true);
      setError(null);
      
      await assumptionsService.updateAssumption(assumptionType, year, value);
      
    } catch (err) {
      console.error('Error updating assumption:', err);
      setError(err.message || 'Failed to update assumption');
      throw err; // Re-throw so components can handle it
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateAssumption,
    loading,
    error
  };
};

export const useEditableB2B = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateClientCount = useCallback(async (tierName, year, clientCount) => {
    try {
      setLoading(true);
      setError(null);
      
      await b2bService.updateClientCount(tierName, year, clientCount);
      
    } catch (err) {
      console.error('Error updating B2B client count:', err);
      setError(err.message || 'Failed to update client count');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePricing = useCallback(async (tierName, year, annualPrice) => {
    try {
      setLoading(true);
      setError(null);
      
      await b2bService.updatePricing(tierName, year, annualPrice);
      
    } catch (err) {
      console.error('Error updating B2B pricing:', err);
      setError(err.message || 'Failed to update pricing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateClientCount,
    updatePricing,
    loading,
    error
  };
};

export const useEditableCosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCost = useCallback(async (costType, year, amount) => {
    try {
      setLoading(true);
      setError(null);
      
      await costsService.updateCost(costType, year, amount);
      
    } catch (err) {
      console.error('Error updating cost:', err);
      setError(err.message || 'Failed to update cost');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateCost,
    loading,
    error
  };
};

export const useEditableHeadcount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateHeadcount = useCallback(async (roleName, year, count) => {
    try {
      setLoading(true);
      setError(null);
      
      await headcountService.updateHeadcount(roleName, year, count);
      
    } catch (err) {
      console.error('Error updating headcount:', err);
      setError(err.message || 'Failed to update headcount');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSalary = useCallback(async (roleName, year, monthlySalary) => {
    try {
      setLoading(true);
      setError(null);
      
      await headcountService.updateSalary(roleName, year, monthlySalary);
      
    } catch (err) {
      console.error('Error updating salary:', err);
      setError(err.message || 'Failed to update salary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateHeadcount,
    updateSalary,
    loading,
    error
  };
};

export const useEditableCashFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCashFlowMetric = useCallback(async (metricType, year, amount) => {
    try {
      setLoading(true);
      setError(null);
      
      await cashFlowService.updateMetric(metricType, year, amount);
      
    } catch (err) {
      console.error('Error updating cash flow metric:', err);
      setError(err.message || 'Failed to update cash flow metric');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateCashFlowMetric,
    loading,
    error
  };
};

export const useEditableScenarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMultiplier = useCallback(async (scenarioId, multiplierType, value) => {
    try {
      setLoading(true);
      setError(null);
      
      await scenarioService.updateMultiplier(scenarioId, multiplierType, value);
      
    } catch (err) {
      console.error('Error updating scenario multiplier:', err);
      setError(err.message || 'Failed to update scenario multiplier');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateMultiplier,
    loading,
    error
  };
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

// Hook to provide optimized data formatters
export const useFinancialFormatters = () => {
  return useMemo(() => ({
    currency: (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value || 0);
    },
    
    percentage: (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format((value || 0));
    },
    
    number: (value) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value || 0);
    },

    compact: (value) => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(value || 0);
    }
  }), []);
};

// Hook for managing bulk updates with optimistic updates
export const useBulkUpdates = () => {
  const [pendingUpdates, setPendingUpdates] = useState(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addUpdate = useCallback((key, updateFunction) => {
    setPendingUpdates(prev => new Map(prev).set(key, updateFunction));
  }, []);

  const removeUpdate = useCallback((key) => {
    setPendingUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const submitAllUpdates = useCallback(async () => {
    if (pendingUpdates.size === 0) return;

    setIsSubmitting(true);
    const updatePromises = Array.from(pendingUpdates.values());
    
    try {
      await Promise.all(updatePromises);
      setPendingUpdates(new Map()); // Clear all pending updates
    } catch (error) {
      console.error('Error submitting bulk updates:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [pendingUpdates]);

  const cancelAllUpdates = useCallback(() => {
    setPendingUpdates(new Map());
  }, []);

  return {
    pendingUpdates: Array.from(pendingUpdates.keys()),
    pendingCount: pendingUpdates.size,
    isSubmitting,
    addUpdate,
    removeUpdate,
    submitAllUpdates,
    cancelAllUpdates
  };
};