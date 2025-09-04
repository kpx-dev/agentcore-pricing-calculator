import React from 'react';
import './App.css';
import { PricingCalculator, ErrorBoundary } from './components';

/**
 * Main Application Component
 * 
 * AWS Bedrock AgentCore Pricing Calculator
 * 
 * This application provides a comprehensive pricing calculator for AWS Bedrock AgentCore services,
 * allowing users to estimate monthly costs based on their expected usage patterns.
 * 
 * Features:
 * - Real-time cost calculations
 * - Detailed cost breakdowns by service component
 * - Input validation and error handling
 * - Export functionality for sharing results
 * - Responsive design for all device sizes
 * - Accessibility compliance
 * 
 * @version 1.0.0
 * @author Kiro AI Assistant
 * @created 2025-01-XX
 */
const App: React.FC = () => {
  /**
   * Handle application-level errors
   */
  const handleAppError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error for monitoring/debugging
    console.error('Application Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // In a production environment, you might want to send this to an error tracking service
    // Example: errorTrackingService.captureException(error, { extra: errorInfo });
  };

  return (
    <div className="App" role="main">
      <ErrorBoundary onError={handleAppError}>
        <PricingCalculator />
      </ErrorBoundary>
    </div>
  );
};

export default App;