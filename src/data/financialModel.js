// Financial Model Data
export const scenarios = {
  1: 'Base',
  2: 'Upside', 
  3: 'Downside'
};

export const scenarioMultipliers = {
  trafficMultiplier: { base: 1.00, upside: 1.50, downside: 0.80 },
  regConversionMultiplier: { base: 1.00, upside: 1.40, downside: 0.95 },
  paidConversionMultiplier: { base: 1.00, upside: 1.30, downside: 0.85 },
  b2cArpuMultiplier: { base: 1.00, upside: 1.10, downside: 0.95 },
  b2bClientsMultiplier: { base: 1.00, upside: 1.25, downside: 0.75 },
  b2bPriceMultiplier: { base: 1.00, upside: 1.00, downside: 1.00 },
  marketingSpendMultiplier: { base: 1.00, upside: 1.10, downside: 1.10 },
  hostingCostMultiplier: { base: 1.00, upside: 0.80, downside: 1.00 },
  gaMultiplier: { base: 1.00, upside: 1.00, downside: 1.10 }
};

export const baseAssumptions = {
  globalNftMarketVolume: {
    2026: 3000000000,
    2027: 4800000000,
    2028: 12000000000
  },
  trafficSessions: {
    2026: 250000,
    2027: 500000,
    2028: 1500000
  },
  walletConnectionRate: {
    2026: 0.10,
    2027: 0.12,
    2028: 0.15
  },
  paidConversionRate: {
    2026: 0.05,
    2027: 0.08,
    2028: 0.12
  },
  avgFee: {
    2026: 0.50,
    2027: 0.50,
    2028: 0.50
  },
  b2cArpu: {
    2026: 600,
    2027: 768,
    2028: 960
  },
  churnMonthly: {
    2026: 0.30,
    2027: 0.35,
    2028: 0.40
  },
  b2bClients: {
    tierD: { 2026: 325, 2027: 750, 2028: 2000 },
    tierC: { 2026: 50, 2027: 120, 2028: 300 },
    tierB: { 2026: 35, 2027: 75, 2028: 125 },
    tierA: { 2026: 15, 2027: 35, 2028: 80 },
    tierAPlus: { 2026: 3, 2027: 10, 2028: 25 }
  },
  b2bPricing: {
    tierD: { 2026: 0, 2027: 0, 2028: 0 },
    tierC: { 2026: 588, 2027: 588, 2028: 708 },
    tierB: { 2026: 2388, 2027: 2388, 2028: 2988 },
    tierA: { 2026: 7188, 2027: 7188, 2028: 8388 },
    tierAPlus: { 2026: 143988, 2027: 143988, 2028: 167988 }
  },
  costs: {
    marketingSpend: { 2026: 1500, 2027: 2500, 2028: 5000 },
    hostingCostPerUser: { 2026: 30000, 2027: 40000, 2028: 50000 },
    gaFixed: { 2026: 1000, 2027: 2000, 2028: 4000 }
  },
  headcount: {
    engineering: { 2026: 3, 2027: 4, 2028: 6 },
    dataML: { 2026: 0, 2027: 1, 2028: 1 },
    productDesign: { 2026: 1, 2027: 2, 2028: 2 },
    sales: { 2026: 1, 2027: 2, 2028: 2 },
    marketing: { 2026: 1, 2027: 1, 2028: 1 },
    opsFinance: { 2026: 0, 2027: 1, 2028: 1 }
  },
  salariesMonthly: {
    engineering: { 2026: 5000, 2027: 5500, 2028: 6000 },
    dataML: { 2026: 5000, 2027: 5500, 2028: 6000 },
    productDesign: { 2026: 4000, 2027: 5000, 2028: 5500 },
    sales: { 2026: 4000, 2027: 4500, 2028: 4500 },
    marketing: { 2026: 3500, 2027: 4000, 2028: 4500 },
    opsFinance: { 2026: 5000, 2027: 5500, 2028: 6000 }
  },
  cashFlow: {
    startingCash: 500000,
    equityRaises: 1500000,
    yearEndCash: {
      2026: 500000,
      2027: 1000000,
      2028: 6000000
    },
    plannedRaises: {
      2026: 1000000,
      2027: 6000000,
      2028: 0
    }
  }
};

// Calculate financial metrics based on scenario
export const calculateFinancials = (scenario = 'base') => {
  const multipliers = Object.keys(scenarioMultipliers).reduce((acc, key) => {
    acc[key] = scenarioMultipliers[key][scenario];
    return acc;
  }, {});

  const results = {};
  
  [2026, 2027, 2028].forEach(year => {
    // Apply multipliers to base assumptions
    const adjustedTraffic = baseAssumptions.trafficSessions[year] * multipliers.trafficMultiplier;
    const adjustedConversionRate = baseAssumptions.paidConversionRate[year] * multipliers.paidConversionMultiplier;
    const adjustedArpu = baseAssumptions.b2cArpu[year] * multipliers.b2cArpuMultiplier;
    
    // B2C Revenue calculation
    const activePaidUsers = adjustedTraffic * baseAssumptions.walletConnectionRate[year] * adjustedConversionRate;
    const b2cRevenue = activePaidUsers * adjustedArpu * 12; // Annual
    
    // B2B Revenue calculation
    let b2bRevenue = 0;
    Object.keys(baseAssumptions.b2bClients).forEach(tier => {
      const clients = baseAssumptions.b2bClients[tier][year] * multipliers.b2bClientsMultiplier;
      const pricing = baseAssumptions.b2bPricing[tier][year] * multipliers.b2bPriceMultiplier;
      b2bRevenue += clients * pricing * 12; // Annual
    });
    
    const totalRevenue = b2cRevenue + b2bRevenue;
    
    // Costs calculation
    const hostingCost = baseAssumptions.costs.hostingCostPerUser[year] * multipliers.hostingCostMultiplier * 12;
    const grossMargin = totalRevenue - hostingCost;
    
    // Operating expenses
    let totalSalaries = 0;
    Object.keys(baseAssumptions.headcount).forEach(role => {
      const headcount = baseAssumptions.headcount[role][year];
      const salary = baseAssumptions.salariesMonthly[role][year];
      totalSalaries += headcount * salary * 12;
    });
    
    const marketingCost = baseAssumptions.costs.marketingSpend[year] * multipliers.marketingSpendMultiplier * 12;
    const gaCost = baseAssumptions.costs.gaFixed[year] * multipliers.gaMultiplier * 12;
    
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
};
