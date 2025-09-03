/**
 * Usage parameters for Bedrock AgentCore pricing calculation
 */
export interface UsageParameters {
  agentInvocations: number;
  knowledgeBaseQueries: number;
  actionGroupExecutions: number;
  storageGB: number;
  dataIngestionGB: number;
}

/**
 * Detailed cost breakdown by service component
 */
export interface CostBreakdown {
  agentInvocationsCost: number;
  knowledgeBaseQueriesCost: number;
  actionGroupExecutionsCost: number;
  storageCost: number;
  dataIngestionCost: number;
  totalMonthlyCost: number;
}

/**
 * Pricing rates configuration for Bedrock AgentCore services
 */
export interface PricingRates {
  agentInvocationRate: number; // per 1000 invocations
  knowledgeBaseQueryRate: number; // per 1000 queries
  actionGroupExecutionRate: number; // per 1000 executions
  storageRatePerGB: number; // per GB per month
  dataIngestionRatePerGB: number; // per GB
  lastUpdated: string; // ISO date string
  sourceUrl: string; // AWS pricing page URL
}