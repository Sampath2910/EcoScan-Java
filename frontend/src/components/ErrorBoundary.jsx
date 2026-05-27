import React from 'react'

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 * Prevents the entire app from crashing due to a single component error
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)

    // You can also log the error to an error reporting service here
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))

    // Optional: Send error to logging service
    if (window.sendErrorToLoggingService) {
      window.sendErrorToLoggingService({
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Something went wrong</h1>
            
            <p className="error-message">
              We're sorry, but something unexpected happened. 
              Our team has been notified and we're working to fix it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details" open>
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button 
                onClick={this.resetError}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-outline"
              >
                Go to Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="error-warning">
                This error has occurred multiple times. 
                Please try clearing your browser cache or restart the app.
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
