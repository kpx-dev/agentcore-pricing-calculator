/**
 * Usage parameters for Bedrock AgentCore and Memory pricing calculation
 */
export interface UsageParameters {
  // Runtime consumption (CPU and Memory hours)
  runtimeCpuHours: number;
  runtimeMemoryGBHours: number;
  
  // Browser Tool consumption (CPU and Memory hours)
  browserToolCpuHours: number;
  browserToolMemoryGBHours: number;
  
  // Code Interpreter consumption (CPU and Memory hours)
  codeInterpreterCpuHours: number;
  codeInterpreterMemoryGBHours: number;
  
  // Gateway API invocations
  gatewayApiInvocations: number; // ListTools, InvokeTool
  gatewaySearchApiInvocations: number; // Search API
  gatewayToolIndexing: number; // Tools indexed per month
  
  // Identity - Token/API key requests
  identityTokenRequests: number;
  
  // Memory service consumption
  memoryShortTermEvents: number; // Short-term memory events per month
  memoryLongTermStorageBuiltIn: number; // Long-term memory storage (built-in) per month
  memoryLongTermStorageCustom: number; // Long-term memory storage (custom) per month
  memoryLongTermRetrievals: number; // Long-term memory retrievals per month
}

/**
 * Detailed cost breakdown by service component
 */
export interface CostBreakdown {
  // Runtime costs
  runtimeCpuCost: number;
  runtimeMemoryCost: number;
  
  // Browser Tool costs
  browserToolCpuCost: number;
  browserToolMemoryCost: number;
  
  // Code Interpreter costs
  codeInterpreterCpuCost: number;
  codeInterpreterMemoryCost: number;
  
  // Gateway costs
  gatewayApiInvocationsCost: number;
  gatewaySearchApiCost: number;
  gatewayToolIndexingCost: number;
  
  // Identity costs
  identityTokenRequestsCost: number;
  
  // Memory service costs
  memoryShortTermEventsCost: number;
  memoryLongTermStorageBuiltInCost: number;
  memoryLongTermStorageCustomCost: number;
  memoryLongTermRetrievalsCost: number;
  
  totalMonthlyCost: number;
}

/**
 * Pricing rates configuration for Bedrock AgentCore and Memory services
 */
export interface PricingRates {
  // Runtime pricing (per hour)
  runtimeCpuRate: number; // per vCPU-hour
  runtimeMemoryRate: number; // per GB-hour
  
  // Browser Tool pricing (per hour)
  browserToolCpuRate: number; // per vCPU-hour
  browserToolMemoryRate: number; // per GB-hour
  
  // Code Interpreter pricing (per hour)
  codeInterpreterCpuRate: number; // per vCPU-hour
  codeInterpreterMemoryRate: number; // per GB-hour
  
  // Gateway pricing
  gatewayApiInvocationRate: number; // per 1,000 invocations
  gatewaySearchApiRate: number; // per 1,000 invocations
  gatewayToolIndexingRate: number; // per 100 tools indexed per month
  
  // Identity pricing
  identityTokenRequestRate: number; // per 1,000 token/API key requests
  
  // Memory service pricing
  memoryShortTermEventRate: number; // per 1,000 new events
  memoryLongTermStorageBuiltInRate: number; // per 1,000 memories stored per month (built-in)
  memoryLongTermStorageCustomRate: number; // per 1,000 memories stored per month (custom)
  memoryLongTermRetrievalRate: number; // per 1,000 memory retrievals
  
  lastUpdated: string; // ISO date string
  sourceUrl: string; // AWS pricing page URL
}