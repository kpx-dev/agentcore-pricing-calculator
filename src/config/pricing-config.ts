import { PricingRates } from '../types';

/**
 * AWS Bedrock AgentCore Pricing Configuration
 * 
 * This file contains the current pricing rates for AWS Bedrock AgentCore services.
 * Rates are based on US East (N. Virginia) region pricing and are subject to change.
 * 
 * To update pricing:
 * 1. Visit the official AWS Bedrock pricing page
 * 2. Update the rates below
 * 3. Update the lastUpdated timestamp
 * 4. Verify the sourceUrl is current
 * 
 * Last verified: January 15, 2025
 * Source: https://aws.amazon.com/bedrock/pricing/
 */

export const BEDROCK_AGENTCORE_PRICING: PricingRates = {
  /**
   * Runtime - Consumption Based
   * CPU: $0.0895 per vCPU-hour
   * Memory: $0.00945 per GB-hour
   */
  runtimeCpuRate: 0.0895,
  runtimeMemoryRate: 0.00945,

  /**
   * Browser Tool - Consumption Based
   * CPU: $0.0895 per vCPU-hour
   * Memory: $0.00945 per GB-hour
   */
  browserToolCpuRate: 0.0895,
  browserToolMemoryRate: 0.00945,

  /**
   * Code Interpreter - Consumption Based
   * CPU: $0.0895 per vCPU-hour
   * Memory: $0.00945 per GB-hour
   */
  codeInterpreterCpuRate: 0.0895,
  codeInterpreterMemoryRate: 0.00945,

  /**
   * Gateway - Consumption Based
   * API Invocations (ListTools, InvokeTool): $0.005 per 1,000 invocations
   * Search API: $0.025 per 1,000 invocations
   * Tool Indexing: $0.02 per 100 tools indexed per month
   */
  gatewayApiInvocationRate: 0.005,
  gatewaySearchApiRate: 0.025,
  gatewayToolIndexingRate: 0.02,

  /**
   * Identity - Consumption Based
   * Token or API key requests for non-AWS resources: $0.010 per 1,000 requests
   * Note: AgentCore Identity is available at no additional charge when used through AgentCore Runtime or Gateway
   */
  identityTokenRequestRate: 0.010,

  /**
   * Memory - Consumption Based
   * Short-Term Memory: $0.25 per 1,000 new events
   * Long-Term Memory Storage (Built-in): $0.75 per 1,000 memories stored per month
   * Long-Term Memory Storage (Custom): $0.25 per 1,000 memories stored per month
   * Long-Term Memory Retrieval: $0.50 per 1,000 memory retrievals
   */
  memoryShortTermEventRate: 0.25,
  memoryLongTermStorageBuiltInRate: 0.75,
  memoryLongTermStorageCustomRate: 0.25,
  memoryLongTermRetrievalRate: 0.50,

  /**
   * Metadata
   */
  lastUpdated: "2025-01-15T00:00:00.000Z",
  sourceUrl: "https://aws.amazon.com/bedrock/pricing/"
};

/**
 * Pricing tiers and volume discounts
 * Note: Currently Bedrock AgentCore uses flat-rate pricing
 * This structure allows for future tiered pricing implementation
 */
export const PRICING_TIERS = {
  // Future implementation for volume discounts
  // Currently all services use flat-rate pricing
};

/**
 * Regional pricing multipliers
 * Base pricing is for US East (N. Virginia)
 * Other regions may have different pricing
 */
export const REGIONAL_MULTIPLIERS = {
  'us-east-1': 1.0, // N. Virginia (base)
  'us-west-2': 1.0, // Oregon
  'eu-west-1': 1.1, // Ireland (example multiplier)
  // Add other regions as needed
};