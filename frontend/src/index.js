/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Custom error logger function
const logError = (error, errorInfo = null) => {
  console.error('React Error:', error);
  if (errorInfo) {
    console.error('Error Info:', errorInfo);
  }
  
  // Here you could send to an error reporting service
  // Example: sendToErrorReportingService(error, errorInfo);
};

// Error handling for React 19
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to load the application. Please refresh the page or contact support.</div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement, {
      onCaughtError: (error, errorInfo) => {
        logError(error, errorInfo);
      },
      onUncaughtError: (error, errorInfo) => {
        logError(error, errorInfo);
        // You could also show a global error UI here
      }
    });
    
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  } catch (error) {
    logError(error);
    document.body.innerHTML = `
      <div style="color: red; padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Application Failed to Start</h2>
        <p>We're sorry, but the application couldn't be loaded. Please try again later.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
          Reload Page
        </button>
      </div>
    `;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
