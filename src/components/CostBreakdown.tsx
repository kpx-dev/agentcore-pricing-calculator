import React from 'react';
import { CostBreakdown as CostBreakdownType } from '../types';
import { formatCurrency, formatLargeNumber } from '../utils/pricing-utils';
import { BEDROCK_AGENTCORE_PRICING } from '../config/pricing-config';
import './CostBreakdown.css';

/**
 * Props for the CostBreakdown component
 */
interface CostBreakdownProps {
  /**
   * Calculated cost breakdown data
   */
  costBreakdown: CostBreakdownType;
  
  /**
   * Whether to show detailed pricing rates
   */
  showPricingRates?: boolean;
  
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;
}

/**
 * Configuration for cost breakdown items
 */
interface CostBreakdownItemConfig {
  key: keyof Omit<CostBreakdownType, 'totalMonthlyCost'>;
  label: string;
  description: string;
  rateLabel: string;
  rateValue: number;
  rateUnit: string;
  icon: string;
}

/**
 * Configuration for all cost breakdown items
 */
const COST_BREAKDOWN_ITEMS: CostBreakdownItemConfig[] = [
  {
    key: 'agentInvocationsCost',
    label: 'Agent Invocations',
    description: 'Cost for agent invocations and processing',
    rateLabel: 'Rate per 1,000 invocations',
    rateValue: BEDROCK_AGENTCORE_PRICING.agentInvocationRate,
    rateUnit: '/ 1K invocations',
    icon: '🤖',
  },
  {
    key: 'knowledgeBaseQueriesCost',
    label: 'Knowledge Base Queries',
    description: 'Cost for searching and retrieving from knowledge bases',
    rateLabel: 'Rate per 1,000 queries',
    rateValue: BEDROCK_AGENTCORE_PRICING.knowledgeBaseQueryRate,
    rateUnit: '/ 1K queries',
    icon: '🔍',
  },
  {
    key: 'actionGroupExecutionsCost',
    label: 'Action Group Executions',
    description: 'Cost for executing action group functions',
    rateLabel: 'Rate per 1,000 executions',
    rateValue: BEDROCK_AGENTCORE_PRICING.actionGroupExecutionRate,
    rateUnit: '/ 1K executions',
    icon: '⚡',
  },
  {
    key: 'storageCost',
    label: 'Knowledge Base Storage',
    description: 'Monthly cost for storing knowledge base data',
    rateLabel: 'Rate per GB per month',
    rateValue: BEDROCK_AGENTCORE_PRICING.storageRatePerGB,
    rateUnit: '/ GB / month',
    icon: '💾',
  },
  {
    key: 'dataIngestionCost',
    label: 'Data Ingestion',
    description: 'One-time cost for ingesting data into knowledge bases',
    rateLabel: 'Rate per GB',
    rateValue: BEDROCK_AGENTCORE_PRICING.dataIngestionRatePerGB,
    rateUnit: '/ GB',
    icon: '📥',
  },
];

/**
 * Individual cost breakdown item component
 */
const CostBreakdownItem: React.FC<{
  config: CostBreakdownItemConfig;
  cost: number;
  showPricingRates: boolean;
}> = ({ config, cost, showPricingRates }) => {
  const hasNonZeroCost = cost > 0;
  
  return (
    <div className={`cost-breakdown-item ${hasNonZeroCost ? 'has-cost' : 'no-cost'}`}>
      <div className="cost-item-header">
        <div className="cost-item-icon" aria-hidden="true">
          {config.icon}
        </div>
        <div className="cost-item-info">
          <h3 className="cost-item-label">{config.label}</h3>
          <p className="cost-item-description">{config.description}</p>
        </div>
        <div className="cost-item-amount">
          <span className="cost-value" aria-label={`Cost: ${formatCurrency(cost)}`}>
            {formatCurrency(cost)}
          </span>
        </div>
      </div>
      
      {showPricingRates && (
        <div className="cost-item-rate">
          <span className="rate-label">{config.rateLabel}:</span>
          <span className="rate-value">
            {formatCurrency(config.rateValue)} {config.rateUnit}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * CostBreakdown Component
 * 
 * Displays detailed cost breakdown by service component with:
 * - Individual cost components with clear labeling
 * - Optional pricing rate information
 * - Responsive layout for different screen sizes
 * - Total monthly cost summary
 * - Loading and empty states
 */
export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  costBreakdown,
  showPricingRates = true,
  loading = false,
}) => {
  // Calculate if there are any non-zero costs
  const hasAnyCosts = COST_BREAKDOWN_ITEMS.some(item => costBreakdown[item.key] > 0);
  const totalCost = costBreakdown.totalMonthlyCost;

  if (loading) {
    return (
      <div className="cost-breakdown loading">
        <div className="breakdown-header">
          <h2>Cost Breakdown</h2>
          <div className="loading-spinner" aria-label="Calculating costs...">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cost-breakdown">
      <div className="breakdown-header">
        <h2>Cost Breakdown</h2>
        <p className="breakdown-description">
          Detailed monthly cost estimate for AWS Bedrock AgentCore services
        </p>
      </div>

      <div className="breakdown-content">
        {!hasAnyCosts ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">📊</div>
            <h3>No Usage Entered</h3>
            <p>Enter your usage parameters above to see cost estimates</p>
          </div>
        ) : (
          <>
            <div className="cost-items">
              {COST_BREAKDOWN_ITEMS.map((item) => (
                <CostBreakdownItem
                  key={item.key}
                  config={item}
                  cost={costBreakdown[item.key]}
                  showPricingRates={showPricingRates}
                />
              ))}
            </div>

            <div className="total-cost-section">
              <div className="total-cost-divider" aria-hidden="true"></div>
              <div className="total-cost-item">
                <div className="total-cost-header">
                  <h3 className="total-cost-label">Total Monthly Cost</h3>
                  <p className="total-cost-description">
                    Estimated monthly cost for all services
                  </p>
                </div>
                <div className="total-cost-amount">
                  <span className="total-cost-value" aria-label={`Total monthly cost: ${formatCurrency(totalCost)}`}>
                    {formatCurrency(totalCost)}
                  </span>
                  <span className="total-cost-period">/ month</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="breakdown-footer">
        <div className="pricing-metadata">
          <p className="pricing-source">
            Pricing based on{' '}
            <a 
              href={BEDROCK_AGENTCORE_PRICING.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pricing-link"
            >
              AWS Bedrock AgentCore Pricing
            </a>
          </p>
          <p className="pricing-updated">
            Last updated: {new Date(BEDROCK_AGENTCORE_PRICING.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        
        <div className="pricing-disclaimer">
          <p>
            * Estimates are based on US East (N. Virginia) region pricing. 
            Actual costs may vary based on your AWS region and usage patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;