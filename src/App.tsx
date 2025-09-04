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
 * - Real-time cost calculations with debounced input handling
 * - Detailed cost breakdowns by service component with pricing rates
 * - Comprehensive input validation and error handling
 * - Export functionality for sharing calculation results
 * - Responsive design optimized for all device sizes
 * - Full accessibility compliance with ARIA labels and keyboard navigation
 * - Error boundaries with graceful fallback UI states
 * - Progressive Web App capabilities
 * 
 * Requirements Fulfilled:
 * - Requirement 1.1: Input fields for all usage parameters with real-time validation
 * - Requirement 1.2: Positive number validation with clear error messages
 * - Requirement 1.3: Real-time cost calculation and display
 * - Requirement 1.4: Reset functionality to default state
 * - Requirement 2.1: Detailed cost breakdown by pricing components
 * - Requirement 2.2: Individual component costs and total estimates
 * - Requirement 2.3: Clear labeling with pricing rate information
 * - Requirement 3.1: Automatic recalculation without submit buttons
 * - Requirement 3.2: Preserved breakdown format during updates
 * - Requirement 3.3: Clear error messages without interface breakage
 * - Requirement 4.1: Current AWS Bedrock AgentCore pricing rates
 * - Requirement 4.2: References to official AWS pricing page
 * - Requirement 4.3: Correct tiered pricing calculations
 * - Requirement 5.1: Copy/export calculation summary functionality
 * - Requirement 5.2: Export includes input parameters and calculated costs
 * - Requirement 5.3: Maintains calculation accuracy in exported format
 * 
 * @version 1.0.0
 * @author Kiro AI Assistant
 * @created 2025-01-09
 * @lastModified 2025-01-09
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