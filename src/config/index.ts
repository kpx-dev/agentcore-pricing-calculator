import { UsageParameters } from '../types';
import { BEDROCK_AGENTCORE_PRICING } from './pricing-config';

// Re-export pricing configuration for easy access
export { BEDROCK_AGENTCORE_PRICING } from './pricing-config';

/**
 * Default usage parameters for initial calculator state
 */
export const DEFAULT_USAGE_PARAMETERS = {
  runtimeCpuHours: 0,
  runtimeMemoryGBHours: 0,
  browserToolCpuHours: 0,
  browserToolMemoryGBHours: 0,
  codeInterpreterCpuHours: 0,
  codeInterpreterMemoryGBHours: 0,
  gatewayApiInvocations: 0,
  gatewaySearchApiInvocations: 0,
  gatewayToolIndexing: 0,
  identityTokenRequests: 0,
  memoryShortTermEvents: 0,
  memoryLongTermStorageBuiltIn: 0,
  memoryLongTermStorageCustom: 0,
  memoryLongTermRetrievals: 0,
};

/**
 * Validation constants for input ranges
 */
export const VALIDATION_LIMITS = {
  MAX_CPU_HOURS: 100000, // 100k vCPU-hours
  MAX_MEMORY_GB_HOURS: 1000000, // 1M GB-hours
  MAX_API_INVOCATIONS: 100000000, // 100 million
  MAX_TOOL_INDEXING: 100000, // 100k tools
  MAX_TOKEN_REQUESTS: 100000000, // 100 million
  MIN_VALUE: 0
};