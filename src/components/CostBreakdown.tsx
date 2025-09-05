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
  // Runtime costs
  {
    key: 'runtimeCpuCost',
    label: 'Runtime CPU',
    description: 'CPU consumption for runtime execution',
    rateLabel: 'Rate per vCPU-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.runtimeCpuRate,
    rateUnit: '/ vCPU-hour',
    icon: '🖥️',
  },
  {
    key: 'runtimeMemoryCost',
    label: 'Runtime Memory',
    description: 'Memory consumption for runtime execution',
    rateLabel: 'Rate per GB-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.runtimeMemoryRate,
    rateUnit: '/ GB-hour',
    icon: '💾',
  },
  
  // Browser Tool costs
  {
    key: 'browserToolCpuCost',
    label: 'Browser Tool CPU',
    description: 'CPU consumption for browser tool operations',
    rateLabel: 'Rate per vCPU-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.browserToolCpuRate,
    rateUnit: '/ vCPU-hour',
    icon: '🌐',
  },
  {
    key: 'browserToolMemoryCost',
    label: 'Browser Tool Memory',
    description: 'Memory consumption for browser tool operations',
    rateLabel: 'Rate per GB-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.browserToolMemoryRate,
    rateUnit: '/ GB-hour',
    icon: '🧠',
  },
  
  // Code Interpreter costs
  {
    key: 'codeInterpreterCpuCost',
    label: 'Code Interpreter CPU',
    description: 'CPU consumption for code interpreter operations',
    rateLabel: 'Rate per vCPU-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.codeInterpreterCpuRate,
    rateUnit: '/ vCPU-hour',
    icon: '⚙️',
  },
  {
    key: 'codeInterpreterMemoryCost',
    label: 'Code Interpreter Memory',
    description: 'Memory consumption for code interpreter operations',
    rateLabel: 'Rate per GB-hour',
    rateValue: BEDROCK_AGENTCORE_PRICING.codeInterpreterMemoryRate,
    rateUnit: '/ GB-hour',
    icon: '🧠',
  },
  
  // Gateway costs
  {
    key: 'gatewayApiInvocationsCost',
    label: 'Gateway API Invocations',
    description: 'Cost for ListTools and InvokeTool API calls',
    rateLabel: 'Rate per 1,000 invocations',
    rateValue: BEDROCK_AGENTCORE_PRICING.gatewayApiInvocationRate,
    rateUnit: '/ 1K invocations',
    icon: '🔗',
  },
  {
    key: 'gatewaySearchApiCost',
    label: 'Gateway Search API',
    description: 'Cost for Search API calls',
    rateLabel: 'Rate per 1,000 invocations',
    rateValue: BEDROCK_AGENTCORE_PRICING.gatewaySearchApiRate,
    rateUnit: '/ 1K invocations',
    icon: '🔍',
  },
  {
    key: 'gatewayToolIndexingCost',
    label: 'Gateway Tool Indexing',
    description: 'Cost for indexing tools per month',
    rateLabel: 'Rate per 100 tools per month',
    rateValue: BEDROCK_AGENTCORE_PRICING.gatewayToolIndexingRate,
    rateUnit: '/ 100 tools/month',
    icon: '📚',
  },
  
  // Identity costs
  {
    key: 'identityTokenRequestsCost',
    label: 'Identity Token Requests',
    description: 'Cost for token/API key requests for non-AWS resources',
    rateLabel: 'Rate per 1,000 requests',
    rateValue: BEDROCK_AGENTCORE_PRICING.identityTokenRequestRate,
    rateUnit: '/ 1K requests',
    icon: '🔐',
  },
  
  // Memory service costs
  {
    key: 'memoryShortTermEventsCost',
    label: 'Memory Short-Term Events',
    description: 'Cost for new short-term memory events',
    rateLabel: 'Rate per 1,000 events',
    rateValue: BEDROCK_AGENTCORE_PRICING.memoryShortTermEventRate,
    rateUnit: '/ 1K events',
    icon: '⚡',
  },
  {
    key: 'memoryLongTermStorageBuiltInCost',
    label: 'Memory Long-Term Storage (Built-in)',
    description: 'Cost for memories stored using built-in strategies',
    rateLabel: 'Rate per 1,000 memories per month',
    rateValue: BEDROCK_AGENTCORE_PRICING.memoryLongTermStorageBuiltInRate,
    rateUnit: '/ 1K memories/month',
    icon: '🧠',
  },
  {
    key: 'memoryLongTermStorageCustomCost',
    label: 'Memory Long-Term Storage (Custom)',
    description: 'Cost for memories stored using custom strategies',
    rateLabel: 'Rate per 1,000 memories per month',
    rateValue: BEDROCK_AGENTCORE_PRICING.memoryLongTermStorageCustomRate,
    rateUnit: '/ 1K memories/month',
    icon: '🎯',
  },
  {
    key: 'memoryLongTermRetrievalsCost',
    label: 'Memory Long-Term Retrievals',
    description: 'Cost for long-term memory retrievals',
    rateLabel: 'Rate per 1,000 retrievals',
    rateValue: BEDROCK_AGENTCORE_PRICING.memoryLongTermRetrievalRate,
    rateUnit: '/ 1K retrievals',
    icon: '🔍',
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
          Detailed monthly cost estimate for AWS Bedrock AgentCore and Memory services
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
              href="https://aws.amazon.com/bedrock/agentcore/pricing/"
              target="_blank"
              rel="noopener noreferrer"
              className="pricing-link"
            >
              AWS Bedrock AgentCore
            </a>
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