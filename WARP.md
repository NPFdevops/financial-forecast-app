# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based Financial Forecast Dashboard that provides interactive scenario planning for NFT marketplace financial projections. The application visualizes financial data across three scenarios (Base, Upside, Downside) with comprehensive P&L modeling, cash flow analysis, and scenario-based multipliers.

## Development Commands

### Standard React Scripts
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode (default when using npm test)
npm test -- --watchAll

# Run specific test file
npm test -- --testNamePattern="App"

# Lint and format (using Create React App's built-in ESLint)
npm test -- --watchAll=false
```

### Testing Individual Components
Since this uses Create React App's testing setup, you can run individual component tests:
```bash
# Test specific component
npm test -- --testNamePattern="ExecutiveSummary"
npm test -- --testNamePattern="AdminPanel"
```

## Code Architecture

### Financial Model Structure
The application is built around a comprehensive financial modeling system with three core concepts:

1. **Base Assumptions** (`src/data/financialModel.js`): Contains all baseline financial parameters including traffic projections, conversion rates, pricing tiers, cost structures, and headcount planning across 2026-2028.

2. **Scenario Multipliers**: Each scenario (Base, Upside, Downside) applies different multipliers to the base assumptions. For example:
   - Traffic multipliers: Base (1.0), Upside (1.2), Downside (0.8)
   - B2B client multipliers: Base (1.0), Upside (1.25), Downside (0.75)

3. **Dynamic Calculations**: The main App component recalculates all financial metrics in real-time when scenarios or assumptions change.

### Component Architecture

- **App.js**: Main state container that manages scenario selection, financial calculations, and admin panel state
- **ExecutiveSummary**: Displays key financial outputs with scenario indication and color-coded metrics
- **AdminPanel**: Modal interface for editing base assumptions and scenario multipliers with live updates
- **ScenarioSelector**: Header component for switching between Base/Upside/Downside scenarios
- **Financial Tables**: PLTable, CashFlowTable, AssumptionsTable for detailed breakdowns
- **FinancialCharts**: Recharts-based visualization components

### Data Flow
1. User selects scenario → triggers `useEffect` in App.js
2. Scenario multipliers are applied to base assumptions
3. Financial calculations run for all three years (2026-2028)
4. All components re-render with updated data
5. Admin panel changes immediately update the model through state callbacks

### Financial Calculations
The core calculation engine handles:
- **B2C Revenue**: Traffic × Wallet Connection Rate × Paid Conversion Rate × ARPU × 12 months
- **B2B Revenue**: Sum across all tiers (Free/C/B/A/A+) of (Client Count × Monthly Price × 12)
- **EBITDA**: Gross Margin - Total OpEx (Salaries + Marketing + G&A)
- **Cash Flow**: Starting Cash + Planned Raises + EBITDA
- **Runway**: Cash Position ÷ Monthly Burn Rate

## File Structure Patterns

- `/src/components/` - All React components with corresponding CSS files
- `/src/data/` - Financial model data and calculation definitions
- `/public/` - Static assets (standard Create React App structure)

## Key Implementation Details

### Real-time Financial Modeling
The application uses React's `useEffect` hook to recalculate financial projections whenever scenario, assumptions, or multipliers change. This ensures all components stay synchronized with the latest financial model.

### Scenario-based Calculations
Each scenario applies different multipliers to base assumptions rather than storing separate data sets. This approach maintains consistency and makes the model easier to understand and modify.

### Professional Financial Formatting
Currency values are formatted with appropriate K/M suffixes and color-coding (green for positive, red for negative) to match professional financial dashboard standards.

### Admin Interface
The AdminPanel component provides a tabbed interface for editing both base assumptions and scenario multipliers. Changes are applied immediately through React state management, allowing users to see the impact of their modifications in real-time.

## Dependencies

- **React 19.1.1**: Core framework with latest concurrent features
- **Recharts 3.2.0**: Professional financial charting library
- **@testing-library**: Complete testing suite for React components
- **react-scripts**: Create React App build system with ESLint integration

## Financial Model Validation

The model includes proper financial calculations with:
- Multi-year projections (2026-2028) 
- B2B tiered pricing structure (Free, Tier C/B/A/A+)
- Headcount planning by function (Engineering, Data/ML, Product/Design, Sales, Marketing, Ops/Finance)
- Cash flow modeling with planned funding rounds
- Runway calculations based on EBITDA burn rates
