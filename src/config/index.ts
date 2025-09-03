import { UsageParameters } from '../types';
import { BEDROCK_AGENTCORE_PRICING } from './pricing-config';

// Re-export pricing configuration for easy access
export { BEDROCK_AGENTCORE_PRICING } from './pricing-config';

/**
 * Default usage parameters for initial calculator state
 */
export const DEFAULT_USAGE_PARAMETERS = {
  agentInvocations: 0,
  knowledgeBaseQueries: 0,
  actionGroupExecutions: 0,
  storageGB: 0,
  dataIngestionGB: 0
};

/**
 * Validation constants for input ranges
 */
export const VALIDATION_LIMITS = {
  MAX_INVOCATIONS: 10000000, // 10 million
  MAX_QUERIES: 10000000, // 10 million
  MAX_EXECUTIONS: 10000000, // 10 million
  MAX_STORAGE_GB: 100000, // 100 TB
  MAX_INGESTION_GB: 100000, // 100 TB
  MIN_VALUE: 0
};