import React from 'react';
import './LoadingComponents.css';

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
      <div className="loading-spinner-inner"></div>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...', transparent = false }) => {
  return (
    <div className={`loading-overlay ${transparent ? 'loading-overlay-transparent' : ''}`}>
      <div className="loading-overlay-content">
        <LoadingSpinner size="large" />
        <p className="loading-overlay-message">{message}</p>
      </div>
    </div>
  );
};

export const InlineLoader = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`inline-loader ${className}`}>
      <LoadingSpinner size="small" />
      <span className="inline-loader-message">{message}</span>
    </div>
  );
};

export const TableLoader = ({ rows = 3, columns = 4 }) => {
  return (
    <div className="table-loader">
      <div className="table-loader-header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="table-loader-header-cell skeleton"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="table-loader-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="table-loader-cell skeleton"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// ERROR COMPONENTS
// ============================================================================

export const ErrorMessage = ({ 
  error, 
  onRetry, 
  className = '',
  showRetry = true,
  retryText = 'Try Again' 
}) => {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-message-icon">⚠️</div>
      <div className="error-message-content">
        <h4 className="error-message-title">Something went wrong</h4>
        <p className="error-message-text">
          {error?.message || error || 'An unexpected error occurred'}
        </p>
        {showRetry && onRetry && (
          <button 
            className="error-message-retry-btn"
            onClick={onRetry}
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export const ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage 
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: null });
            if (this.props.onRetry) {
              this.props.onRetry();
            }
          }}
          className="error-boundary"
        />
      );
    }

    return this.props.children;
  }
};

// ============================================================================
// EMPTY STATE COMPONENTS
// ============================================================================

export const EmptyState = ({ 
  title = 'No data available',
  message = 'There is no data to display at this time.',
  icon = '📊',
  action = null,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

// ============================================================================
// STATUS COMPONENTS
// ============================================================================

export const ConnectionStatus = ({ isConnected, lastUpdated }) => {
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
      <span className="connection-text">
        {isConnected ? 'Connected' : 'Disconnected'}
        {lastUpdated && isConnected && (
          <span className="connection-last-updated">
            {' '}• Last updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </span>
    </div>
  );
};

export const SavingIndicator = ({ isSaving, lastSaved, error }) => {
  if (error) {
    return (
      <div className="saving-indicator error">
        <span className="saving-icon">❌</span>
        <span className="saving-text">Failed to save</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="saving-indicator saving">
        <LoadingSpinner size="small" />
        <span className="saving-text">Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="saving-indicator saved">
        <span className="saving-icon">✅</span>
        <span className="saving-text">
          Saved {new Date(lastSaved).toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return null;
};

// ============================================================================
// PROGRESS COMPONENTS
// ============================================================================

export const ProgressBar = ({ 
  progress, 
  max = 100, 
  label = '', 
  showPercentage = true,
  className = '' 
}) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  return (
    <div className={`progress-bar ${className}`}>
      {label && <div className="progress-bar-label">{label}</div>}
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="progress-bar-percentage">{Math.round(percentage)}%</div>
      )}
    </div>
  );
};

// ============================================================================
// CONDITIONAL WRAPPER COMPONENTS
// ============================================================================

export const DataWrapper = ({ 
  loading, 
  error, 
  data, 
  children, 
  loadingComponent,
  errorComponent,
  emptyComponent,
  onRetry 
}) => {
  if (loading) {
    return loadingComponent || <InlineLoader message="Loading data..." />;
  }

  if (error) {
    return errorComponent || (
      <ErrorMessage 
        error={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return emptyComponent || <EmptyState />;
  }

  return children;
};

export const TableWrapper = ({ 
  loading, 
  error, 
  data, 
  children, 
  rows = 3, 
  columns = 4,
  onRetry 
}) => {
  return (
    <DataWrapper
      loading={loading}
      error={error}
      data={data}
      loadingComponent={<TableLoader rows={rows} columns={columns} />}
      onRetry={onRetry}
    >
      {children}
    </DataWrapper>
  );
};