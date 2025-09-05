import React, { useState, useCallback, useEffect } from "react";
import { UsageParameters, CostBreakdown } from "../types";
import {
  calculateCostBreakdown,
  DEFAULT_USAGE,
  sanitizeUsageParameters,
} from "../utils/pricing-utils";
import {
  UsageInputForm,
  CostBreakdown as CostBreakdownComponent,
  ExportResults,
  ScenarioTemplates,
} from "./index";
import "./PricingCalculator.css";
import "./ErrorBoundary.css";

/**
 * Props for the PricingCalculator component
 */
interface PricingCalculatorProps {
  /**
   * Initial usage parameters (optional)
   */
  initialUsage?: Partial<UsageParameters>;

  /**
   * Whether to show pricing rates in the breakdown
   */
  showPricingRates?: boolean;

  /**
   * Custom CSS class name
   */
  className?: string;
}

/**
 * Application error types
 */
interface AppError {
  type: "calculation" | "validation" | "general";
  message: string;
  details?: string;
}

/**
 * PricingCalculator Component
 *
 * Main container component that orchestrates all child components:
 * - Manages state for usage parameters and calculated results
 * - Connects input changes to real-time calculation updates
 * - Handles application-level error states and loading states
 * - Provides error boundaries and fallback UI states
 */
export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  initialUsage = {},
  showPricingRates = true,
  className = "",
}) => {
  // Main application state
  const [usageParameters, setUsageParameters] = useState<UsageParameters>(
    () => {
      const sanitizedInitial = sanitizeUsageParameters(initialUsage);
      return { ...DEFAULT_USAGE, ...sanitizedInitial };
    }
  );

  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>(() => {
    const initialSanitized = sanitizeUsageParameters(initialUsage);
    const initialUsageParams = { ...DEFAULT_USAGE, ...initialSanitized };
    return calculateCostBreakdown(initialUsageParams);
  });

  // Loading and error states
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [appError, setAppError] = useState<AppError | null>(null);

  /**
   * Handle usage parameter changes with error handling
   */
  const handleUsageChange = useCallback((newUsage: UsageParameters) => {
    try {
      setAppError(null);
      setIsCalculating(true);

      // Sanitize the input parameters
      const sanitizedUsage = sanitizeUsageParameters(newUsage);

      // Update usage parameters state
      setUsageParameters(sanitizedUsage);

      // Calculate new cost breakdown
      const newCostBreakdown = calculateCostBreakdown(sanitizedUsage);
      setCostBreakdown(newCostBreakdown);
    } catch (error) {
      console.error("Calculation error:", error);
      setAppError({
        type: "calculation",
        message: "Failed to calculate costs",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      // Add small delay to show loading state for better UX
      setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    }
  }, []);

  /**
   * Clear current error state
   */
  const clearError = useCallback(() => {
    setAppError(null);
  }, []);

  /**
   * Effect to handle initial calculation on mount
   */
  useEffect(() => {
    try {
      const initialCostBreakdown = calculateCostBreakdown(usageParameters);
      setCostBreakdown(initialCostBreakdown);
    } catch (error) {
      console.error("Initial calculation error:", error);
      setAppError({
        type: "calculation",
        message: "Failed to perform initial calculation",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, []); // Only run on mount

  // Check if there are any non-zero usage parameters
  const hasUsageData = Object.values(usageParameters).some(
    (value) => value > 0
  );

  return (
    <div className={`pricing-calculator ${className}`}>
      {/* Application Header */}
      <header className="calculator-header">
        <h1>AWS Bedrock AgentCore Calculator (Unofficial)</h1>
        <p className="calculator-description">
          Estimate your monthly costs for AWS Bedrock AgentCore services based
          on your expected usage patterns.
        </p>
      </header>

      {/* Error Display */}
      {appError && (
        <div className="error-banner" role="alert">
          <div className="error-content">
            <div className="error-icon" aria-hidden="true">
              ⚠️
            </div>
            <div className="error-details">
              <h3 className="error-title">
                {appError.type === "calculation"
                  ? "Calculation Error"
                  : appError.type === "validation"
                  ? "Validation Error"
                  : "Application Error"}
              </h3>
              <p className="error-message">{appError.message}</p>
              {appError.details && (
                <details className="error-details-toggle">
                  <summary>Technical Details</summary>
                  <p className="error-technical-details">{appError.details}</p>
                </details>
              )}
            </div>
            <button
              className="error-dismiss"
              onClick={clearError}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Calculator Content */}
      <main className="calculator-content">
        <div className="calculator-grid">
          {/* Scenario Templates Section */}
          <section
            className="templates-section"
            aria-labelledby="templates-section-title"
          >
            <h2
              id="templates-section-title"
              className="section-title visually-hidden"
            >
              Scenario Templates
            </h2>
            <ScenarioTemplates
              onTemplateSelect={handleUsageChange}
              disabled={isCalculating}
            />
          </section>

          {/* Input Section */}
          <section
            className="input-section"
            aria-labelledby="input-section-title"
          >
            <h2
              id="input-section-title"
              className="section-title visually-hidden"
            >
              Usage Parameters Input
            </h2>
            <UsageInputForm
              usageParameters={usageParameters}
              onSubmit={handleUsageChange}
              disabled={isCalculating}
            />
          </section>

          {/* Results Section */}
          <section
            className="results-section"
            aria-labelledby="results-section-title"
          >
            <h2
              id="results-section-title"
              className="section-title visually-hidden"
            >
              Cost Breakdown Results
            </h2>
            <CostBreakdownComponent
              costBreakdown={costBreakdown}
              showPricingRates={showPricingRates}
              loading={isCalculating}
            />

            {/* Export Section */}
            {hasUsageData && !isCalculating && (
              <div className="export-section">
                <ExportResults
                  usageParameters={usageParameters}
                  costBreakdown={costBreakdown}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Application Footer */}
      <footer className="calculator-footer">
        <div className="footer-content">
          <div className="disclaimer">
            <h3>Important Notes</h3>
            <ul>
              <li>
                All cost estimates are based on current AWS Bedrock AgentCore
                and Memory pricing for US East (N. Virginia) region
              </li>
              <li>
                Actual costs may vary based on your specific AWS region, usage
                patterns, and any applicable discounts
              </li>
              <li>
                This calculator is for estimation purposes only and does not
                constitute a pricing guarantee
              </li>
              <li>
                For the most up-to-date pricing information, please refer to the
                official AWS pricing page
              </li>
            </ul>
          </div>

          <div className="calculator-info">
            <p>
              Built for developers evaluating AWS Bedrock AgentCore costs. Last
              updated: {new Date().toLocaleDateString()}. Created by <a href="https://www.linkedin.com/in/kpx-dev/">Kien Pham</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingCalculator;
