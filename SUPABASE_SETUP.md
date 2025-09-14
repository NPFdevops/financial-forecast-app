# Supabase Integration Setup Guide

This guide will walk you through setting up Supabase for your Financial Forecasting App to replace hardcoded data with a dynamic database backend.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - **Name**: `financial-forecast-app`
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
6. Click "Create new project"
7. Wait for the project to be set up (usually takes 1-2 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll see two important values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `src/database/schema.sql`
4. Click **Run** to execute the schema creation
5. Verify that all tables were created by going to **Table Editor**

You should see these tables:
- `scenarios`
- `scenario_multipliers`
- `base_assumptions`
- `b2b_tiers`
- `b2b_clients`
- `b2b_pricing`
- `costs`
- `employee_roles`
- `headcount`
- `salaries`
- `cash_flow`

### 5. Start Your Application

```bash
npm start
```

Your app should now be connected to Supabase! 🎉

## 📊 Database Schema Overview

### Core Tables

**scenarios**
- Stores the three financial scenarios (Base, Upside, Downside)

**scenario_multipliers**
- Contains multiplier values for each scenario to adjust base assumptions

**base_assumptions**
- Stores fundamental business metrics (traffic, conversion rates, ARPU, etc.)

**b2b_tiers** & **b2b_clients** & **b2b_pricing**
- Manages B2B client data across different pricing tiers

**costs**
- Stores operational costs (marketing, hosting, G&A)

**employee_roles** & **headcount** & **salaries**
- Manages employee data and compensation

**cash_flow**
- Stores cash flow projections and fundraising plans

### Key Features

- **Row Level Security (RLS)**: Currently set to allow all operations for development
- **Foreign Key Constraints**: Maintain data integrity
- **Indexed Fields**: Optimized for common query patterns
- **Audit Fields**: `created_at` and `updated_at` timestamps

## 🛠️ Development Workflow

### Making Changes to Financial Data

The app now supports real-time editing through the UI. Changes are automatically saved to Supabase.

### Adding New Data Fields

1. Add the field to the appropriate table schema in `src/database/schema.sql`
2. Update the corresponding service function in `src/services/financialModelService.js`
3. Update the React components to display/edit the new field

### Testing Database Changes

You can test database operations directly in the Supabase dashboard:
1. Go to **Table Editor**
2. Select any table
3. Edit data directly to see changes reflected in your app

## 🔧 API Usage Examples

### Loading Financial Data

```javascript
import { useScenarioData } from '../hooks/useFinancialModel';

function MyComponent() {
  const { data, loading, error, calculations } = useScenarioData('Base');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{/* Your component JSX */}</div>;
}
```

### Updating Assumptions

```javascript
import { useEditableAssumptions } from '../hooks/useFinancialModel';

function AssumptionEditor() {
  const { updateAssumption, loading, error } = useEditableAssumptions();
  
  const handleUpdate = async (type, year, value) => {
    try {
      await updateAssumption(type, year, value);
      // Show success message
    } catch (err) {
      // Handle error
    }
  };
  
  return <div>{/* Your editor JSX */}</div>;
}
```

## 🔒 Security Considerations

### Row Level Security (RLS)

The current setup has RLS enabled but with permissive policies for development. For production, you should:

1. Set up proper authentication
2. Create restrictive RLS policies
3. Consider user roles and permissions

Example production policy:
```sql
-- Only allow authenticated users to read data
CREATE POLICY "Users can read financial data" ON base_assumptions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow admin users to modify data
CREATE POLICY "Admins can modify financial data" ON base_assumptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Environment Variables

- Never commit your `.env` file to version control
- Use different Supabase projects for development, staging, and production
- Regularly rotate your API keys

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Check that your `.env` file has the correct variable names
- Restart your development server after updating `.env`

**"Failed to load financial model data"**
- Verify your Supabase project is running
- Check the browser console for detailed error messages
- Ensure your database schema was created successfully

**"Error calculating financials"**
- Check that all required data is present in the database
- Verify scenario multipliers are set correctly

### Database Connection Issues

1. Check Supabase project status in the dashboard
2. Verify your API keys are correct
3. Check browser network tab for failed requests

### Performance Issues

- Monitor your Supabase usage in the dashboard
- Consider adding database indexes for frequently queried fields
- Use the built-in caching in the React hooks

## 📈 Next Steps

### Recommended Improvements

1. **Add User Authentication**
   - Implement user registration/login
   - Restrict data access based on user roles

2. **Add Data Validation**
   - Implement schema validation on the client side
   - Add database constraints for data integrity

3. **Add Audit Logging**
   - Track who made what changes and when
   - Implement change history/rollback functionality

4. **Add Real-time Subscriptions**
   - Use Supabase realtime features for collaborative editing
   - Show when other users are making changes

5. **Add Data Export/Import**
   - Allow exporting financial models to Excel/CSV
   - Support importing data from external sources

### Monitoring and Maintenance

- Monitor database performance in Supabase dashboard
- Set up alerts for high usage or errors
- Regularly backup your data
- Keep your dependencies updated

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Integration](https://supabase.com/docs/guides/with-react)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

Need help? Check the browser console for detailed error messages or create an issue in the project repository.