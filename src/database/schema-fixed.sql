-- Financial Forecasting App Database Schema
-- Fixed version with proper RLS policies for development

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS cash_flow CASCADE;
DROP TABLE IF EXISTS salaries CASCADE;  
DROP TABLE IF EXISTS headcount CASCADE;
DROP TABLE IF EXISTS employee_roles CASCADE;
DROP TABLE IF EXISTS costs CASCADE;
DROP TABLE IF EXISTS b2b_pricing CASCADE;
DROP TABLE IF EXISTS b2b_clients CASCADE;
DROP TABLE IF EXISTS b2b_tiers CASCADE;
DROP TABLE IF EXISTS base_assumptions CASCADE;
DROP TABLE IF EXISTS scenario_multipliers CASCADE;
DROP TABLE IF EXISTS scenarios CASCADE;

-- 1. Scenarios table
CREATE TABLE scenarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default scenarios
INSERT INTO scenarios (id, name, description) VALUES 
(1, 'Base', 'Base case scenario with realistic projections'),
(2, 'Upside', 'Optimistic scenario with favorable market conditions'),
(3, 'Downside', 'Conservative scenario with challenging market conditions');

-- 2. Scenario multipliers table
CREATE TABLE scenario_multipliers (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    multiplier_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scenario_id, multiplier_type)
);

-- Insert scenario multipliers
INSERT INTO scenario_multipliers (scenario_id, multiplier_type, value) VALUES
-- Base scenario multipliers
(1, 'traffic_multiplier', 1.0000),
(1, 'reg_conversion_multiplier', 1.0000),
(1, 'paid_conversion_multiplier', 1.0000),
(1, 'b2c_arpu_multiplier', 1.0000),
(1, 'b2b_clients_multiplier', 1.0000),
(1, 'b2b_price_multiplier', 1.0000),
(1, 'marketing_spend_multiplier', 1.0000),
(1, 'hosting_cost_multiplier', 1.0000),
(1, 'ga_multiplier', 1.0000),

-- Upside scenario multipliers  
(2, 'traffic_multiplier', 1.5000),
(2, 'reg_conversion_multiplier', 1.4000),
(2, 'paid_conversion_multiplier', 1.3000),
(2, 'b2c_arpu_multiplier', 1.1000),
(2, 'b2b_clients_multiplier', 1.2500),
(2, 'b2b_price_multiplier', 1.0000),
(2, 'marketing_spend_multiplier', 1.1000),
(2, 'hosting_cost_multiplier', 0.8000),
(2, 'ga_multiplier', 1.0000),

-- Downside scenario multipliers
(3, 'traffic_multiplier', 0.8000),
(3, 'reg_conversion_multiplier', 0.9500),
(3, 'paid_conversion_multiplier', 0.8500),
(3, 'b2c_arpu_multiplier', 0.9500),
(3, 'b2b_clients_multiplier', 0.7500),
(3, 'b2b_price_multiplier', 1.0000),
(3, 'marketing_spend_multiplier', 1.1000),
(3, 'hosting_cost_multiplier', 1.0000),
(3, 'ga_multiplier', 1.1000);

-- 3. Base assumptions table
CREATE TABLE base_assumptions (
    id SERIAL PRIMARY KEY,
    assumption_type VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assumption_type, year)
);

-- Insert base assumptions
INSERT INTO base_assumptions (assumption_type, year, value, unit, description) VALUES
-- Global NFT Market Volume
('global_nft_market_volume', 2026, 3000000000, 'USD', 'Global NFT market volume'),
('global_nft_market_volume', 2027, 4800000000, 'USD', 'Global NFT market volume'),
('global_nft_market_volume', 2028, 12000000000, 'USD', 'Global NFT market volume'),

-- Traffic Sessions
('traffic_sessions', 2026, 250000, 'sessions', 'Monthly traffic sessions'),
('traffic_sessions', 2027, 500000, 'sessions', 'Monthly traffic sessions'),
('traffic_sessions', 2028, 1500000, 'sessions', 'Monthly traffic sessions'),

-- Wallet Connection Rate
('wallet_connection_rate', 2026, 0.1000, 'rate', 'Rate of users connecting wallets'),
('wallet_connection_rate', 2027, 0.1200, 'rate', 'Rate of users connecting wallets'),
('wallet_connection_rate', 2028, 0.1500, 'rate', 'Rate of users connecting wallets'),

-- Paid Conversion Rate
('paid_conversion_rate', 2026, 0.0500, 'rate', 'Rate of users converting to paid'),
('paid_conversion_rate', 2027, 0.0800, 'rate', 'Rate of users converting to paid'),
('paid_conversion_rate', 2028, 0.1200, 'rate', 'Rate of users converting to paid'),

-- Average Fee
('avg_fee', 2026, 0.5000, 'USD', 'Average fee per transaction'),
('avg_fee', 2027, 0.5000, 'USD', 'Average fee per transaction'),
('avg_fee', 2028, 0.5000, 'USD', 'Average fee per transaction'),

-- B2C ARPU
('b2c_arpu', 2026, 600, 'USD', 'B2C Annual Revenue Per User'),
('b2c_arpu', 2027, 768, 'USD', 'B2C Annual Revenue Per User'),
('b2c_arpu', 2028, 960, 'USD', 'B2C Annual Revenue Per User'),

-- Monthly Churn
('churn_monthly', 2026, 0.3000, 'rate', 'Monthly churn rate'),
('churn_monthly', 2027, 0.3500, 'rate', 'Monthly churn rate'),
('churn_monthly', 2028, 0.4000, 'rate', 'Monthly churn rate');

-- 4. B2B Client tiers and pricing
CREATE TABLE b2b_tiers (
    id SERIAL PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    tier_order INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO b2b_tiers (tier_name, tier_order, description) VALUES
('tier_d', 1, 'Tier D - Entry level'),
('tier_c', 2, 'Tier C - Standard'),  
('tier_b', 3, 'Tier B - Professional'),
('tier_a', 4, 'Tier A - Enterprise'),
('tier_a_plus', 5, 'Tier A+ - Premium Enterprise');

CREATE TABLE b2b_clients (
    id SERIAL PRIMARY KEY,
    tier_id INTEGER REFERENCES b2b_tiers(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    client_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tier_id, year)
);

CREATE TABLE b2b_pricing (
    id SERIAL PRIMARY KEY,
    tier_id INTEGER REFERENCES b2b_tiers(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    annual_price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tier_id, year)
);

-- Insert B2B client data
INSERT INTO b2b_clients (tier_id, year, client_count) VALUES
-- Get tier IDs dynamically
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2026, 325),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2027, 750),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2028, 2000),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2026, 50),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2027, 120),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2028, 300),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2026, 35),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2027, 75),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2028, 125),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2026, 15),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2027, 35),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2028, 80),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2026, 3),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2027, 10),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2028, 25);

-- Insert B2B pricing data
INSERT INTO b2b_pricing (tier_id, year, annual_price) VALUES
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2026, 0),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2027, 0),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_d'), 2028, 0),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2026, 588),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2027, 588),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_c'), 2028, 708),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2026, 2388),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2027, 2388),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_b'), 2028, 2988),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2026, 7188),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2027, 7188),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a'), 2028, 8388),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2026, 143988),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2027, 143988),
((SELECT id FROM b2b_tiers WHERE tier_name = 'tier_a_plus'), 2028, 167988);

-- 5. Costs table  
CREATE TABLE costs (
    id SERIAL PRIMARY KEY,
    cost_type VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cost_type, year)
);

INSERT INTO costs (cost_type, year, amount, unit, description) VALUES
('marketing_spend', 2026, 1500, 'USD_monthly', 'Monthly marketing spend'),
('marketing_spend', 2027, 2500, 'USD_monthly', 'Monthly marketing spend'),
('marketing_spend', 2028, 5000, 'USD_monthly', 'Monthly marketing spend'),
('hosting_cost_per_user', 2026, 30000, 'USD_monthly', 'Monthly hosting cost per user'),
('hosting_cost_per_user', 2027, 40000, 'USD_monthly', 'Monthly hosting cost per user'),
('hosting_cost_per_user', 2028, 50000, 'USD_monthly', 'Monthly hosting cost per user'),
('ga_fixed', 2026, 1000, 'USD_monthly', 'Monthly G&A fixed costs'),
('ga_fixed', 2027, 2000, 'USD_monthly', 'Monthly G&A fixed costs'),
('ga_fixed', 2028, 4000, 'USD_monthly', 'Monthly G&A fixed costs');

-- 6. Employee roles table
CREATE TABLE employee_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO employee_roles (role_name, description) VALUES
('engineering', 'Software Engineering'),
('data_ml', 'Data Science and Machine Learning'),
('product_design', 'Product and Design'),
('sales', 'Sales'),
('marketing', 'Marketing'),
('ops_finance', 'Operations and Finance');

-- 7. Headcount table
CREATE TABLE headcount (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES employee_roles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, year)
);

-- 8. Salaries table  
CREATE TABLE salaries (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES employee_roles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    monthly_salary DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, year)
);

-- Insert headcount data
INSERT INTO headcount (role_id, year, count) VALUES
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2026, 3),
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2027, 4),
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2028, 6),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2026, 0),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2027, 1),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2028, 1),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2026, 1),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2027, 2),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2028, 2),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2026, 1),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2027, 2),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2028, 2),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2026, 1),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2027, 1),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2028, 1),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2026, 0),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2027, 1),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2028, 1);

-- Insert salary data
INSERT INTO salaries (role_id, year, monthly_salary) VALUES
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2026, 5000),
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2027, 5500),
((SELECT id FROM employee_roles WHERE role_name = 'engineering'), 2028, 6000),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2026, 5000),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2027, 5500),
((SELECT id FROM employee_roles WHERE role_name = 'data_ml'), 2028, 6000),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2026, 4000),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2027, 5000),
((SELECT id FROM employee_roles WHERE role_name = 'product_design'), 2028, 5500),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2026, 4000),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2027, 4500),
((SELECT id FROM employee_roles WHERE role_name = 'sales'), 2028, 4500),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2026, 3500),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2027, 4000),
((SELECT id FROM employee_roles WHERE role_name = 'marketing'), 2028, 4500),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2026, 5000),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2027, 5500),
((SELECT id FROM employee_roles WHERE role_name = 'ops_finance'), 2028, 6000);

-- 9. Cash flow table
CREATE TABLE cash_flow (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL,
    year INTEGER,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_type, year)
);

INSERT INTO cash_flow (metric_type, year, amount, description) VALUES
('starting_cash', NULL, 500000, 'Starting cash amount'),
('equity_raises', NULL, 1500000, 'Total equity raises'),
('year_end_cash', 2026, 500000, 'Expected year-end cash'),
('year_end_cash', 2027, 1000000, 'Expected year-end cash'),
('year_end_cash', 2028, 6000000, 'Expected year-end cash'),
('planned_raises', 2026, 1000000, 'Planned fundraising amount'),
('planned_raises', 2027, 6000000, 'Planned fundraising amount'),
('planned_raises', 2028, 0, 'Planned fundraising amount');

-- Create indexes for better performance
CREATE INDEX idx_scenario_multipliers_scenario_id ON scenario_multipliers(scenario_id);
CREATE INDEX idx_base_assumptions_year ON base_assumptions(year);
CREATE INDEX idx_b2b_clients_year ON b2b_clients(year);
CREATE INDEX idx_b2b_pricing_year ON b2b_pricing(year);
CREATE INDEX idx_costs_year ON costs(year);
CREATE INDEX idx_headcount_year ON headcount(year);
CREATE INDEX idx_salaries_year ON salaries(year);
CREATE INDEX idx_cash_flow_year ON cash_flow(year);

-- Enable RLS (Row Level Security) - IMPORTANT: Enable but allow all access for development
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_multipliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE headcount ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow ENABLE ROW LEVEL SECURITY;

-- FIXED: Create policies that properly allow all operations for development
-- Using both USING and WITH CHECK clauses for complete access
CREATE POLICY "Allow all access for dev" ON scenarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON scenario_multipliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON base_assumptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON b2b_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON b2b_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON b2b_pricing FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON employee_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON headcount FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON salaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for dev" ON cash_flow FOR ALL USING (true) WITH CHECK (true);

-- Success message
SELECT 'Database schema created successfully with proper RLS policies!' as result;