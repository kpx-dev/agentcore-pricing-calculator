import { UsageParameters, CostBreakdown } from '../types';
import { BEDROCK_AGENTCORE_PRICING } from '../config/pricing-config';

/**
 * Utility constants for pricing calculations
 */
export const PRICING_CONSTANTS = {
  UNITS_PER_THOUSAND: 1000,
  CURRENCY_PRECISION: 4, // Number of decimal places for cost calculations
  DISPLAY_PRECISION: 2, // Number of decimal places for display
} as const;

/**
 * Validation limits for usage parameters
 */
export const USAGE_LIMITS = {
  MIN_VALUE: 0,
  MAX_INVOCATIONS: 100_000_000, // 100 million
  MAX_QUERIES: 100_000_000, // 100 million  
  MAX_EXECUTIONS: 100_000_000, // 100 million
  MAX_STORAGE_GB: 1_000_000, // 1 PB
  MAX_INGESTION_GB: 1_000_000, // 1 PB
} as const;

/**
 * Default usage parameters for calculator initialization
 */
export const DEFAULT_USAGE: UsageParameters = {
  agentInvocations: 0,
  knowledgeBaseQueries: 0,
  actionGroupExecutions: 0,
  storageGB: 0,
  dataIngestionGB: 0,
};

/**
 * Helper function to validate usage parameter ranges
 */
export const isValidUsageValue = (value: number, type: keyof UsageParameters): boolean => {
  if (value < USAGE_LIMITS.MIN_VALUE) return false;
  
  switch (type) {
    case 'agentInvocations':
      return value <= USAGE_LIMITS.MAX_INVOCATIONS;
    case 'knowledgeBaseQueries':
      return value <= USAGE_LIMITS.MAX_QUERIES;
    case 'actionGroupExecutions':
      return value <= USAGE_LIMITS.MAX_EXECUTIONS;
    case 'storageGB':
      return value <= USAGE_LIMITS.MAX_STORAGE_GB;
    case 'dataIngestionGB':
      return value <= USAGE_LIMITS.MAX_INGESTION_GB;
    default:
      return false;
  }
};

/**
 * Helper function to get pricing metadata
 */
export const getPricingMetadata = () => ({
  lastUpdated: BEDROCK_AGENTCORE_PRICING.lastUpdated,
  sourceUrl: BEDROCK_AGENTCORE_PRICING.sourceUrl,
  region: 'us-east-1', // Default region
});

/**
 * Core calculation functions
 */

/**
 * Calculate cost for agent invocations
 * @param invocations - Number of agent invocations
 * @param rate - Rate per 1000 invocations
 * @returns Cost in USD
 */
export const calculateAgentInvocationsCost = (invocations: number, rate: number = BEDROCK_AGENTCORE_PRICING.agentInvocationRate): number => {
  if (invocations < 0) return 0;
  return (invocations / PRICING_CONSTANTS.UNITS_PER_THOUSAND) * rate;
};

/**
 * Calculate cost for knowledge base queries
 * @param queries - Number of knowledge base queries
 * @param rate - Rate per 1000 queries
 * @returns Cost in USD
 */
export const calculateKnowledgeBaseQueriesCost = (queries: number, rate: number = BEDROCK_AGENTCORE_PRICING.knowledgeBaseQueryRate): number => {
  if (queries < 0) return 0;
  return (queries / PRICING_CONSTANTS.UNITS_PER_THOUSAND) * rate;
};

/**
 * Calculate cost for action group executions
 * @param executions - Number of action group executions
 * @param rate - Rate per 1000 executions
 * @returns Cost in USD
 */
export const calculateActionGroupExecutionsCost = (executions: number, rate: number = BEDROCK_AGENTCORE_PRICING.actionGroupExecutionRate): number => {
  if (executions < 0) return 0;
  return (executions / PRICING_CONSTANTS.UNITS_PER_THOUSAND) * rate;
};

/**
 * Calculate cost for knowledge base storage
 * @param storageGB - Storage amount in GB
 * @param rate - Rate per GB per month
 * @returns Monthly cost in USD
 */
export const calculateStorageCost = (storageGB: number, rate: number = BEDROCK_AGENTCORE_PRICING.storageRatePerGB): number => {
  if (storageGB < 0) return 0;
  return storageGB * rate;
};

/**
 * Calculate cost for data ingestion
 * @param ingestionGB - Data ingestion amount in GB
 * @param rate - Rate per GB
 * @returns One-time cost in USD
 */
export const calculateDataIngestionCost = (ingestionGB: number, rate: number = BEDROCK_AGENTCORE_PRICING.dataIngestionRatePerGB): number => {
  if (ingestionGB < 0) return 0;
  return ingestionGB * rate;
};

/**
 * Calculate complete cost breakdown for given usage parameters
 * @param usage - Usage parameters
 * @param customRates - Optional custom pricing rates (defaults to current config)
 * @returns Detailed cost breakdown
 */
export const calculateCostBreakdown = (usage: UsageParameters, customRates?: Partial<typeof BEDROCK_AGENTCORE_PRICING>): CostBreakdown => {
  const rates = { ...BEDROCK_AGENTCORE_PRICING, ...customRates };
  
  const agentInvocationsCost = calculateAgentInvocationsCost(usage.agentInvocations, rates.agentInvocationRate);
  const knowledgeBaseQueriesCost = calculateKnowledgeBaseQueriesCost(usage.knowledgeBaseQueries, rates.knowledgeBaseQueryRate);
  const actionGroupExecutionsCost = calculateActionGroupExecutionsCost(usage.actionGroupExecutions, rates.actionGroupExecutionRate);
  const storageCost = calculateStorageCost(usage.storageGB, rates.storageRatePerGB);
  const dataIngestionCost = calculateDataIngestionCost(usage.dataIngestionGB, rates.dataIngestionRatePerGB);
  
  const totalMonthlyCost = agentInvocationsCost + knowledgeBaseQueriesCost + actionGroupExecutionsCost + storageCost + dataIngestionCost;
  
  return {
    agentInvocationsCost: roundToPrecision(agentInvocationsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    knowledgeBaseQueriesCost: roundToPrecision(knowledgeBaseQueriesCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    actionGroupExecutionsCost: roundToPrecision(actionGroupExecutionsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    storageCost: roundToPrecision(storageCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    dataIngestionCost: roundToPrecision(dataIngestionCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    totalMonthlyCost: roundToPrecision(totalMonthlyCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
  };
};

/**
 * Tiered pricing calculation (future implementation)
 * Currently Bedrock AgentCore uses flat-rate pricing, but this structure
 * allows for easy implementation of volume discounts in the future
 */
export interface PricingTier {
  threshold: number;
  rate: number;
}

/**
 * Calculate cost with tiered pricing structure
 * @param usage - Usage amount
 * @param tiers - Array of pricing tiers (sorted by threshold ascending)
 * @returns Cost based on tiered pricing
 */
export const calculateTieredCost = (usage: number, tiers: PricingTier[]): number => {
  if (usage <= 0 || tiers.length === 0) return 0;
  
  let totalCost = 0;
  let remainingUsage = usage;
  
  for (let i = 0; i < tiers.length; i++) {
    const currentTier = tiers[i];
    const nextTier = tiers[i + 1];
    
    // Determine usage amount for this tier
    const tierUsage = nextTier 
      ? Math.min(remainingUsage, nextTier.threshold - currentTier.threshold)
      : remainingUsage;
    
    if (tierUsage <= 0) break;
    
    // Calculate cost for this tier
    totalCost += (tierUsage / PRICING_CONSTANTS.UNITS_PER_THOUSAND) * currentTier.rate;
    remainingUsage -= tierUsage;
    
    if (remainingUsage <= 0) break;
  }
  
  return totalCost;
};

/**
 * Currency formatting utilities
 */

/**
 * Round number to specified precision
 * @param value - Number to round
 * @param precision - Number of decimal places
 * @returns Rounded number
 */
export const roundToPrecision = (value: number, precision: number): number => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

/**
 * Format currency value for display
 * @param value - Currency value in USD
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  options: {
    precision?: number;
    showCents?: boolean;
    locale?: string;
  } = {}
): string => {
  const {
    precision = PRICING_CONSTANTS.DISPLAY_PRECISION,
    showCents = true,
    locale = 'en-US'
  } = options;
  
  // Handle edge cases
  if (!isFinite(value) || isNaN(value)) {
    return '$0.00';
  }
  
  // If showCents is false, round to nearest dollar first
  const valueToFormat = showCents ? Math.abs(value) : Math.round(Math.abs(value));
  
  // Format using Intl.NumberFormat for proper localization
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? precision : 0,
    maximumFractionDigits: showCents ? precision : 0,
  });
  
  const formatted = formatter.format(valueToFormat);
  
  // Add negative sign if needed (after currency symbol)
  return value < 0 ? `-${formatted}` : formatted;
};

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param value - Number to format
 * @param precision - Decimal places for display
 * @returns Formatted number string
 */
export const formatLargeNumber = (value: number, precision: number = 1): string => {
  if (!isFinite(value) || isNaN(value)) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) {
    return `${sign}${roundToPrecision(absValue / 1_000_000_000, precision)}B`;
  } else if (absValue >= 1_000_000) {
    return `${sign}${roundToPrecision(absValue / 1_000_000, precision)}M`;
  } else if (absValue >= 1_000) {
    return `${sign}${roundToPrecision(absValue / 1_000, precision)}K`;
  } else {
    return `${sign}${roundToPrecision(absValue, precision)}`;
  }
};

/**
 * Edge case handling utilities
 */

/**
 * Validate and sanitize usage parameters
 * @param usage - Raw usage parameters
 * @returns Sanitized usage parameters
 */
export const sanitizeUsageParameters = (usage: Partial<UsageParameters>): UsageParameters => {
  const sanitized: UsageParameters = { ...DEFAULT_USAGE };
  
  // Sanitize each parameter
  Object.keys(sanitized).forEach((key) => {
    const typedKey = key as keyof UsageParameters;
    const rawValue = usage[typedKey];
    
    if (typeof rawValue === 'number' && isFinite(rawValue)) {
      // Clamp to valid range
      const clampedValue = Math.max(USAGE_LIMITS.MIN_VALUE, rawValue);
      sanitized[typedKey] = isValidUsageValue(clampedValue, typedKey) ? clampedValue : 0;
    }
  });
  
  return sanitized;
};

/**
 * Check if cost calculation results are reasonable
 * @param breakdown - Cost breakdown to validate
 * @returns Validation result with any warnings
 */
export const validateCostBreakdown = (breakdown: CostBreakdown): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  let isValid = true;
  
  // Check for unreasonably high costs (potential input errors)
  const HIGH_COST_THRESHOLD = 100_000; // $100k per month
  if (breakdown.totalMonthlyCost > HIGH_COST_THRESHOLD) {
    warnings.push(`Total monthly cost (${formatCurrency(breakdown.totalMonthlyCost)}) is unusually high. Please verify your usage parameters.`);
  }
  
  // Check for negative costs (should not happen with proper validation)
  Object.entries(breakdown).forEach(([key, value]) => {
    if (value < 0) {
      warnings.push(`Negative cost detected for ${key}: ${formatCurrency(value)}`);
      isValid = false;
    }
  });
  
  // Check for NaN or infinite values
  Object.entries(breakdown).forEach(([key, value]) => {
    if (!isFinite(value) || isNaN(value)) {
      warnings.push(`Invalid cost value for ${key}: ${value}`);
      isValid = false;
    }
  });
  
  return { isValid, warnings };
};