import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // You could send to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container mx-auto p-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="mb-4">We're sorry, but an error occurred while rendering this page.</p>
          
          <details className="mb-4 text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-semibold">Error details</summary>
            <p className="mt-2 text-red-600">{this.state.error && this.state.error.toString()}</p>
            <div className="mt-2 overflow-auto max-h-64">
              <pre className="text-sm">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          </details>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            
            <Link
              to="/"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
