import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CostBreakdown } from '../CostBreakdown';
import { CostBreakdown as CostBreakdownType } from '../../types';

// Mock cost breakdown data for testing
const mockCostBreakdown: CostBreakdownType = {
  agentInvocationsCost: 2.50,
  knowledgeBaseQueriesCost: 2.00,
  actionGroupExecutionsCost: 0.70,
  storageCost: 1.00,
  dataIngestionCost: 1.00,
  totalMonthlyCost: 7.20,
};

const emptyCostBreakdown: CostBreakdownType = {
  agentInvocationsCost: 0,
  knowledgeBaseQueriesCost: 0,
  actionGroupExecutionsCost: 0,
  storageCost: 0,
  dataIngestionCost: 0,
  totalMonthlyCost: 0,
};

describe('CostBreakdown Component', () => {
  describe('Rendering', () => {
    it('renders the component with cost breakdown data', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText('Cost Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Detailed monthly cost estimate for AWS Bedrock AgentCore services')).toBeInTheDocument();
    });

    it('displays all cost breakdown items', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText('Agent Invocations')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Base Queries')).toBeInTheDocument();
      expect(screen.getByText('Action Group Executions')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Base Storage')).toBeInTheDocument();
      expect(screen.getByText('Data Ingestion')).toBeInTheDocument();
    });

    it('displays formatted cost values', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText('$2.50')).toBeInTheDocument();
      expect(screen.getByText('$2.00')).toBeInTheDocument();
      expect(screen.getByText('$0.70')).toBeInTheDocument();
      expect(screen.getAllByText('$1.00')).toHaveLength(2); // Storage and ingestion both have $1.00
    });

    it('displays total monthly cost', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText('Total Monthly Cost')).toBeInTheDocument();
      expect(screen.getByText('$7.20')).toBeInTheDocument();
      expect(screen.getByText('/ month')).toBeInTheDocument();
    });
  });

  describe('Pricing Rates', () => {
    it('shows pricing rates by default', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText('Rate per 1,000 invocations:')).toBeInTheDocument();
      expect(screen.getByText('Rate per 1,000 queries:')).toBeInTheDocument();
      expect(screen.getByText('Rate per 1,000 executions:')).toBeInTheDocument();
      expect(screen.getByText('Rate per GB per month:')).toBeInTheDocument();
      expect(screen.getByText('Rate per GB:')).toBeInTheDocument();
    });

    it('hides pricing rates when showPricingRates is false', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} showPricingRates={false} />);
      
      expect(screen.queryByText('Rate per 1,000 invocations:')).not.toBeInTheDocument();
      expect(screen.queryByText('Rate per 1,000 queries:')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when all costs are zero', () => {
      render(<CostBreakdown costBreakdown={emptyCostBreakdown} />);
      
      expect(screen.getByText('No Usage Entered')).toBeInTheDocument();
      expect(screen.getByText('Enter your usage parameters above to see cost estimates')).toBeInTheDocument();
    });

    it('does not show cost items in empty state', () => {
      render(<CostBreakdown costBreakdown={emptyCostBreakdown} />);
      
      expect(screen.queryByText('Agent Invocations')).not.toBeInTheDocument();
      expect(screen.queryByText('Total Monthly Cost')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading prop is true', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} loading={true} />);
      
      expect(screen.getByText('Cost Breakdown')).toBeInTheDocument();
      expect(screen.getByLabelText('Calculating costs...')).toBeInTheDocument();
    });

    it('does not show cost items when loading', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} loading={true} />);
      
      expect(screen.queryByText('Agent Invocations')).not.toBeInTheDocument();
      expect(screen.queryByText('Total Monthly Cost')).not.toBeInTheDocument();
    });
  });

  describe('Footer Information', () => {
    it('displays pricing source link', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      const pricingLink = screen.getByRole('link', { name: /AWS Bedrock AgentCore Pricing/i });
      expect(pricingLink).toBeInTheDocument();
      expect(pricingLink).toHaveAttribute('href', 'https://aws.amazon.com/bedrock/pricing/');
      expect(pricingLink).toHaveAttribute('target', '_blank');
      expect(pricingLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays last updated date', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });

    it('displays pricing disclaimer', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByText(/Estimates are based on US East/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for cost values', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      expect(screen.getByLabelText('Cost: $2.50')).toBeInTheDocument();
      expect(screen.getByLabelText('Total monthly cost: $7.20')).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Cost Breakdown' });
      expect(mainHeading).toBeInTheDocument();
      
      const itemHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(itemHeadings.length).toBeGreaterThan(0);
    });

    it('has proper role for loading spinner', () => {
      render(<CostBreakdown costBreakdown={mockCostBreakdown} loading={true} />);
      
      expect(screen.getByLabelText('Calculating costs...')).toBeInTheDocument();
    });
  });

  describe('Cost Item States', () => {
    it('applies correct CSS classes for items with costs', () => {
      const { container } = render(<CostBreakdown costBreakdown={mockCostBreakdown} />);
      
      const costItems = container.querySelectorAll('.cost-breakdown-item');
      expect(costItems.length).toBeGreaterThan(0);
      
      // Check that items with non-zero costs have the 'has-cost' class
      const itemsWithCosts = container.querySelectorAll('.cost-breakdown-item.has-cost');
      expect(itemsWithCosts.length).toBeGreaterThan(0);
    });

    it('applies correct CSS classes for items without costs', () => {
      const partialCostBreakdown: CostBreakdownType = {
        agentInvocationsCost: 2.50,
        knowledgeBaseQueriesCost: 0, // Zero cost
        actionGroupExecutionsCost: 0, // Zero cost
        storageCost: 1.00,
        dataIngestionCost: 0, // Zero cost
        totalMonthlyCost: 3.50,
      };

      const { container } = render(<CostBreakdown costBreakdown={partialCostBreakdown} />);
      
      const itemsWithoutCosts = container.querySelectorAll('.cost-breakdown-item.no-cost');
      expect(itemsWithoutCosts.length).toBe(3); // Three items with zero costs
    });
  });

  describe('Component Integration', () => {
    it('handles very small cost values correctly', () => {
      const smallCostBreakdown: CostBreakdownType = {
        agentInvocationsCost: 0.0001,
        knowledgeBaseQueriesCost: 0.0002,
        actionGroupExecutionsCost: 0.0001,
        storageCost: 0.0001,
        dataIngestionCost: 0.0001,
        totalMonthlyCost: 0.0006,
      };

      render(<CostBreakdown costBreakdown={smallCostBreakdown} />);
      
      // Small values are formatted with default precision (2 decimal places), so they show as $0.00
      expect(screen.getAllByText('$0.00')).toHaveLength(6); // 5 individual costs + 1 total = 6 total
    });

    it('handles large cost values correctly', () => {
      const largeCostBreakdown: CostBreakdownType = {
        agentInvocationsCost: 1250.75,
        knowledgeBaseQueriesCost: 2000.50,
        actionGroupExecutionsCost: 875.25,
        storageCost: 100.00,
        dataIngestionCost: 200.00,
        totalMonthlyCost: 4426.50,
      };

      render(<CostBreakdown costBreakdown={largeCostBreakdown} />);
      
      expect(screen.getByText('$1,250.75')).toBeInTheDocument();
      expect(screen.getByText('$4,426.50')).toBeInTheDocument();
    });
  });
});