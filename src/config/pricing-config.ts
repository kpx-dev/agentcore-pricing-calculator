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
   * Agent Invocations
   * Cost per 1,000 agent invocations
   * Each invocation represents a single request to an agent
   */
  agentInvocationRate: 0.00025,

  /**
   * Knowledge Base Queries
   * Cost per 1,000 knowledge base queries
   * Each query represents a search against the knowledge base
   */
  knowledgeBaseQueryRate: 0.0004,

  /**
   * Action Group Executions
   * Cost per 1,000 action group executions
   * Each execution represents running an action group function
   */
  actionGroupExecutionRate: 0.00035,

  /**
   * Knowledge Base Storage
   * Cost per GB per month for storing knowledge base data
   * Charged monthly for the amount of data stored
   */
  storageRatePerGB: 0.10,

  /**
   * Data Ingestion
   * Cost per GB for ingesting data into knowledge bases
   * One-time charge when data is first ingested
   */
  dataIngestionRatePerGB: 0.20,

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