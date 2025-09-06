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
  MAX_CPU_HOURS: 100_000, // 100k vCPU-hours per month
  MAX_MEMORY_GB_HOURS: 1_000_000, // 1M GB-hours per month
  MAX_API_INVOCATIONS: 1_000_000_000, // 1 billion invocations (increased to support HR Assistant scenario)
  MAX_TOOL_INDEXING: 100_000, // 100k tools
  MAX_TOKEN_REQUESTS: 1_000_000_000, // 1 billion requests (increased for consistency)
} as const;

/**
 * Default usage parameters for calculator initialization
 */
export const DEFAULT_USAGE: UsageParameters = {
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
 * Helper function to validate usage parameter ranges
 */
export const isValidUsageValue = (value: number, type: keyof UsageParameters): boolean => {
  if (value < USAGE_LIMITS.MIN_VALUE) return false;
  
  switch (type) {
    case 'runtimeCpuHours':
    case 'browserToolCpuHours':
    case 'codeInterpreterCpuHours':
      return value <= USAGE_LIMITS.MAX_CPU_HOURS;
    case 'runtimeMemoryGBHours':
    case 'browserToolMemoryGBHours':
    case 'codeInterpreterMemoryGBHours':
      return value <= USAGE_LIMITS.MAX_MEMORY_GB_HOURS;
    case 'gatewayApiInvocations':
    case 'gatewaySearchApiInvocations':
    case 'identityTokenRequests':
    case 'memoryShortTermEvents':
    case 'memoryLongTermStorageBuiltIn':
    case 'memoryLongTermStorageCustom':
    case 'memoryLongTermRetrievals':
      return value <= USAGE_LIMITS.MAX_API_INVOCATIONS;
    case 'gatewayToolIndexing':
      return value <= USAGE_LIMITS.MAX_TOOL_INDEXING;
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
 * Calculate cost for CPU hours
 * @param cpuHours - Number of vCPU hours
 * @param rate - Rate per vCPU-hour
 * @returns Cost in USD
 */
export const calculateCpuCost = (cpuHours: number, rate: number): number => {
  if (cpuHours < 0) return 0;
  return cpuHours * rate;
};

/**
 * Calculate cost for memory hours
 * @param memoryGBHours - Number of GB-hours
 * @param rate - Rate per GB-hour
 * @returns Cost in USD
 */
export const calculateMemoryCost = (memoryGBHours: number, rate: number): number => {
  if (memoryGBHours < 0) return 0;
  return memoryGBHours * rate;
};

/**
 * Calculate cost for API invocations
 * @param invocations - Number of API invocations
 * @param rate - Rate per 1000 invocations
 * @returns Cost in USD
 */
export const calculateApiInvocationsCost = (invocations: number, rate: number): number => {
  if (invocations < 0) return 0;
  return (invocations / PRICING_CONSTANTS.UNITS_PER_THOUSAND) * rate;
};

/**
 * Calculate cost for tool indexing
 * @param toolCount - Number of tools indexed
 * @param rate - Rate per 100 tools per month
 * @returns Monthly cost in USD
 */
export const calculateToolIndexingCost = (toolCount: number, rate: number): number => {
  if (toolCount < 0) return 0;
  return (toolCount / 100) * rate;
};

/**
 * Calculate complete cost breakdown for given usage parameters
 * @param usage - Usage parameters
 * @param customRates - Optional custom pricing rates (defaults to current config)
 * @returns Detailed cost breakdown
 */
export const calculateCostBreakdown = (usage: UsageParameters, customRates?: Partial<typeof BEDROCK_AGENTCORE_PRICING>): CostBreakdown => {
  const rates = { ...BEDROCK_AGENTCORE_PRICING, ...customRates };
  
  // Runtime costs
  const runtimeCpuCost = calculateCpuCost(usage.runtimeCpuHours, rates.runtimeCpuRate);
  const runtimeMemoryCost = calculateMemoryCost(usage.runtimeMemoryGBHours, rates.runtimeMemoryRate);
  
  // Browser Tool costs
  const browserToolCpuCost = calculateCpuCost(usage.browserToolCpuHours, rates.browserToolCpuRate);
  const browserToolMemoryCost = calculateMemoryCost(usage.browserToolMemoryGBHours, rates.browserToolMemoryRate);
  
  // Code Interpreter costs
  const codeInterpreterCpuCost = calculateCpuCost(usage.codeInterpreterCpuHours, rates.codeInterpreterCpuRate);
  const codeInterpreterMemoryCost = calculateMemoryCost(usage.codeInterpreterMemoryGBHours, rates.codeInterpreterMemoryRate);
  
  // Gateway costs
  const gatewayApiInvocationsCost = calculateApiInvocationsCost(usage.gatewayApiInvocations, rates.gatewayApiInvocationRate);
  const gatewaySearchApiCost = calculateApiInvocationsCost(usage.gatewaySearchApiInvocations, rates.gatewaySearchApiRate);
  const gatewayToolIndexingCost = calculateToolIndexingCost(usage.gatewayToolIndexing, rates.gatewayToolIndexingRate);
  
  // Identity costs
  const identityTokenRequestsCost = calculateApiInvocationsCost(usage.identityTokenRequests, rates.identityTokenRequestRate);
  
  // Memory service costs
  const memoryShortTermEventsCost = calculateApiInvocationsCost(usage.memoryShortTermEvents, rates.memoryShortTermEventRate);
  const memoryLongTermStorageBuiltInCost = calculateApiInvocationsCost(usage.memoryLongTermStorageBuiltIn, rates.memoryLongTermStorageBuiltInRate);
  const memoryLongTermStorageCustomCost = calculateApiInvocationsCost(usage.memoryLongTermStorageCustom, rates.memoryLongTermStorageCustomRate);
  const memoryLongTermRetrievalsCost = calculateApiInvocationsCost(usage.memoryLongTermRetrievals, rates.memoryLongTermRetrievalRate);
  
  const totalMonthlyCost = runtimeCpuCost + runtimeMemoryCost + browserToolCpuCost + browserToolMemoryCost + 
                          codeInterpreterCpuCost + codeInterpreterMemoryCost + gatewayApiInvocationsCost + 
                          gatewaySearchApiCost + gatewayToolIndexingCost + identityTokenRequestsCost +
                          memoryShortTermEventsCost + memoryLongTermStorageBuiltInCost + 
                          memoryLongTermStorageCustomCost + memoryLongTermRetrievalsCost;
  
  return {
    runtimeCpuCost: roundToPrecision(runtimeCpuCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    runtimeMemoryCost: roundToPrecision(runtimeMemoryCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    browserToolCpuCost: roundToPrecision(browserToolCpuCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    browserToolMemoryCost: roundToPrecision(browserToolMemoryCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    codeInterpreterCpuCost: roundToPrecision(codeInterpreterCpuCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    codeInterpreterMemoryCost: roundToPrecision(codeInterpreterMemoryCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    gatewayApiInvocationsCost: roundToPrecision(gatewayApiInvocationsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    gatewaySearchApiCost: roundToPrecision(gatewaySearchApiCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    gatewayToolIndexingCost: roundToPrecision(gatewayToolIndexingCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    identityTokenRequestsCost: roundToPrecision(identityTokenRequestsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    memoryShortTermEventsCost: roundToPrecision(memoryShortTermEventsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    memoryLongTermStorageBuiltInCost: roundToPrecision(memoryLongTermStorageBuiltInCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    memoryLongTermStorageCustomCost: roundToPrecision(memoryLongTermStorageCustomCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
    memoryLongTermRetrievalsCost: roundToPrecision(memoryLongTermRetrievalsCost, PRICING_CONSTANTS.CURRENCY_PRECISION),
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