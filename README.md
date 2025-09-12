# Financial Forecast Dashboard

A React application for visualizing financial projections with interactive scenario planning.

## Features

- **🎯 Executive Summary**: High-level overview of key financial metrics with clear scenario indication
- **⚙️ Admin Panel**: Edit financial assumptions and scenario multipliers with live updates
- **📊 Interactive Charts**: Visual analysis of revenue growth, EBITDA progression, and financial trends
- **🔄 Dynamic Scenario Selection**: Switch between Base, Upside, and Downside scenarios with real-time updates
- **💰 Comprehensive Financial Modeling**: Full P&L statements, cash flow, and runway calculations
- **📈 Visual Analytics**: Professional charts showing revenue breakdown and financial progression
- **✏️ Editable Parameters**: Modify base assumptions and multipliers through the admin interface
- **🎨 Professional Interface**: Modern, gradient-based design with intuitive navigation

## Scenarios

### Base Scenario (Conservative Baseline)
- Traffic multiplier: 100%
- B2B clients: 100%
- Marketing spend: 100%
- All other metrics at baseline levels

### Upside Scenario (Optimistic Growth)
- Traffic multiplier: 120%
- B2B clients: 125%
- B2C ARPU: 110%
- Improved conversion rates across metrics

### Downside Scenario (Conservative Downside)
- Traffic multiplier: 80%
- B2B clients: 75%
- Higher hosting costs: 110%
- Reduced conversion rates

## Key Metrics Tracked

### Revenue
- B2C Revenue (subscription-based)
- B2B/API Revenue (tiered pricing)
- Total Revenue

### Costs
- Hosting costs (COGS)
- Salaries by function
- Marketing spend
- General & Administrative expenses

### Key Financial Metrics
- Gross Margin
- EBITDA
- Cash Flow
- Runway calculations

## Data Structure

The application uses a comprehensive financial model with:
- Multi-year projections (2026-2028)
- Detailed assumptions for user acquisition and retention
- B2B tiered pricing structure (Free, Tier C, Tier B, Tier A, Tier A+)
- Headcount planning by function
- Cash flow modeling with planned funding rounds

## Usage

### Basic Navigation
1. **Executive Summary**: View key financial outputs at the top with clear scenario indication
2. **Select Scenario**: Use the scenario buttons in the header to switch between Base, Upside, and Downside projections
3. **Review Assumptions**: The assumptions table shows how each scenario affects key multipliers
4. **Analyze Charts**: Interactive charts show revenue growth, EBITDA trends, and financial comparisons
5. **Detailed P&L**: Comprehensive profit & loss statements with scenario-based calculations
6. **Cash Flow Analysis**: Track cash runway and funding needs based on EBITDA projections

### Admin Features
7. **Edit Model**: Click the "⚙️ Edit Model" button in the header to access the admin panel
8. **Modify Assumptions**: Update base traffic, conversion rates, pricing, and cost assumptions
9. **Adjust Multipliers**: Fine-tune scenario multipliers for traffic, clients, costs, etc.
10. **Live Updates**: All changes are reflected immediately across all components

## Technical Details

- Built with React 18
- Responsive design with CSS Grid/Flexbox
- Real-time calculations based on scenario selection
- Professional financial data formatting
- Color-coded metrics (green for positive, red for negative)

## Getting Started

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000)

```bash
npm run build
```

Builds the app for production deployment.

## Financial Model Accuracy

The financial model includes:
- ✅ Proper revenue calculations (B2C ARPU × users × 12 months)
- ✅ B2B tiered pricing structure
- ✅ Cost scaling with business metrics
- ✅ Cash flow projections with funding rounds
- ✅ Runway calculations based on burn rate
- ✅ Scenario impact on all key drivers
