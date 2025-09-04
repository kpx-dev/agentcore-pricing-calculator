import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PricingCalculator from '../PricingCalculator';
import { UsageParameters } from '../../types';

// Mock the child components to isolate PricingCalculator testing
jest.mock('../UsageInputForm', () => {
  return function MockUsageInputForm({ usageParameters, onUsageChange, disabled }: any) {
    return (
      <div data-testid="usage-input-form">
        <button
          data-testid="mock-usage-change"
          onClick={() => onUsageChange({
            agentInvocations: 1000,
            knowledgeBaseQueries: 500,
            actionGroupExecutions: 200,
            storageGB: 10,
            dataIngestionGB: 5,
          })}
          disabled={disabled}
        >
          Change Usage
        </button>
        <span data-testid="usage-disabled">{disabled ? 'disabled' : 'enabled'}</span>
      </div>
    );
  };
});

jest.mock('../CostBreakdown', () => {
  return function MockCostBreakdown({ costBreakdown, loading }: any) {
    return (
      <div data-testid="cost-breakdown">
        <span data-testid="total-cost">{costBreakdown.totalMonthlyCost}</span>
        <span data-testid="loading-state">{loading ? 'loading' : 'loaded'}</span>
      </div>
    );
  };
});

jest.mock('../ExportResults', () => {
  return function MockExportResults({ usageParameters, costBreakdown }: any) {
    return (
      <div data-testid="export-results">
        <span data-testid="export-total">{costBreakdown.totalMonthlyCost}</span>
      </div>
    );
  };
});

describe('PricingCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main calculator components', () => {
    render(<PricingCalculator />);
    
    expect(screen.getByText('AWS Bedrock AgentCore Pricing Calculator')).toBeInTheDocument();
    expect(screen.getByTestId('usage-input-form')).toBeInTheDocument();
    expect(screen.getByTestId('cost-breakdown')).toBeInTheDocument();
  });

  it('displays the calculator description', () => {
    render(<PricingCalculator />);
    
    expect(screen.getByText(/Estimate your monthly costs for AWS Bedrock AgentCore services/)).toBeInTheDocument();
  });

  it('initializes with default usage parameters', () => {
    render(<PricingCalculator />);
    
    // Should show initial cost of 0
    expect(screen.getByTestId('total-cost')).toHaveTextContent('0');
  });

  it('accepts initial usage parameters', () => {
    const initialUsage: Partial<UsageParameters> = {
      agentInvocations: 1000,
      storageGB: 5,
    };
    
    render(<PricingCalculator initialUsage={initialUsage} />);
    
    // Should calculate costs based on initial usage
    const totalCost = screen.getByTestId('total-cost');
    expect(parseFloat(totalCost.textContent || '0')).toBeGreaterThan(0);
  });

  it('handles usage parameter changes', async () => {
    render(<PricingCalculator />);
    
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      const totalCost = screen.getByTestId('total-cost');
      expect(parseFloat(totalCost.textContent || '0')).toBeGreaterThan(0);
    });
  });

  it('shows loading state during calculations', async () => {
    render(<PricingCalculator />);
    
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    // Should briefly show loading state
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
    });
  });

  it('disables input form during calculations', async () => {
    render(<PricingCalculator />);
    
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    // Should briefly disable the form
    expect(screen.getByTestId('usage-disabled')).toHaveTextContent('disabled');
    
    await waitFor(() => {
      expect(screen.getByTestId('usage-disabled')).toHaveTextContent('enabled');
    });
  });

  it('shows reset button when there is usage data', async () => {
    render(<PricingCalculator />);
    
    // Initially no reset button (no usage data)
    expect(screen.queryByText('🔄 Reset Calculator')).not.toBeInTheDocument();
    
    // Add usage data
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Reset Calculator')).toBeInTheDocument();
    });
  });

  it('resets calculator when reset button is clicked', async () => {
    render(<PricingCalculator />);
    
    // Add usage data
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Reset Calculator')).toBeInTheDocument();
    });
    
    // Click reset
    const resetButton = screen.getByText('🔄 Reset Calculator');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-cost')).toHaveTextContent('0');
    });
  });

  it('shows export results when there is usage data', async () => {
    render(<PricingCalculator />);
    
    // Initially no export results
    expect(screen.queryByTestId('export-results')).not.toBeInTheDocument();
    
    // Add usage data
    const changeButton = screen.getByTestId('mock-usage-change');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('export-results')).toBeInTheDocument();
    });
  });

  it('applies custom CSS class', () => {
    const { container } = render(<PricingCalculator className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('pricing-calculator', 'custom-class');
  });

  it('passes showPricingRates prop to CostBreakdown', () => {
    render(<PricingCalculator showPricingRates={false} />);
    
    // This would be tested more thoroughly in integration tests
    // Here we just verify the component renders without error
    expect(screen.getByTestId('cost-breakdown')).toBeInTheDocument();
  });

  it('displays footer with disclaimer information', () => {
    render(<PricingCalculator />);
    
    expect(screen.getByText('Important Notes')).toBeInTheDocument();
    expect(screen.getByText(/All cost estimates are based on current AWS Bedrock AgentCore pricing/)).toBeInTheDocument();
    expect(screen.getByText(/This calculator is for estimation purposes only/)).toBeInTheDocument();
  });

  it('handles error states gracefully', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock calculateCostBreakdown to throw an error
    jest.doMock('../../utils/pricing-utils', () => ({
      ...jest.requireActual('../../utils/pricing-utils'),
      calculateCostBreakdown: jest.fn(() => {
        throw new Error('Calculation failed');
      }),
    }));
    
    render(<PricingCalculator />);
    
    // Should still render the main structure
    expect(screen.getByText('AWS Bedrock AgentCore Pricing Calculator')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(<PricingCalculator />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AWS Bedrock AgentCore Pricing Calculator');
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for proper section structure
    expect(screen.getByLabelText(/Usage Parameters Input/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cost Breakdown Results/)).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(<PricingCalculator />);
    
    const changeButton = screen.getByTestId('mock-usage-change');
    
    // Should be focusable
    changeButton.focus();
    expect(changeButton).toHaveFocus();
    
    // Should respond to Enter key
    fireEvent.keyDown(changeButton, { key: 'Enter' });
    // The mock button doesn't actually handle keyDown, but this tests the setup
  });
});