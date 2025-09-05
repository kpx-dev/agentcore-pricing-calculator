/**
 * Advanced calculation engine for Bedrock AgentCore pricing
 * 
 * This module provides advanced calculation features including:
 * - Batch calculations for multiple scenarios
 * - Cost optimization suggestions
 * - Usage pattern analysis
 */

import { UsageParameters, CostBreakdown } from '../types';
import { calculateCostBreakdown, formatCurrency, sanitizeUsageParameters } from './pricing-utils';

/**
 * Calculate costs for multiple usage scenarios
 * @param scenarios - Array of usage parameter scenarios
 * @returns Array of cost breakdowns for each scenario
 */
export const calculateBatchCosts = (scenarios: UsageParameters[]): CostBreakdown[] => {
  return scenarios.map(scenario => {
    const sanitizedUsage = sanitizeUsageParameters(scenario);
    return calculateCostBreakdown(sanitizedUsage);
  });
};

/**
 * Compare two usage scenarios and highlight differences
 * @param baseline - Baseline usage scenario
 * @param comparison - Comparison usage scenario
 * @returns Comparison analysis with cost differences
 */
export const compareScenarios = (baseline: UsageParameters, comparison: UsageParameters) => {
  const baselineCosts = calculateCostBreakdown(sanitizeUsageParameters(baseline));
  const comparisonCosts = calculateCostBreakdown(sanitizeUsageParameters(comparison));
  
  const differences = {
    runtimeCpuCostDiff: comparisonCosts.runtimeCpuCost - baselineCosts.runtimeCpuCost,
    runtimeMemoryCostDiff: comparisonCosts.runtimeMemoryCost - baselineCosts.runtimeMemoryCost,
    browserToolCpuCostDiff: comparisonCosts.browserToolCpuCost - baselineCosts.browserToolCpuCost,
    browserToolMemoryCostDiff: comparisonCosts.browserToolMemoryCost - baselineCosts.browserToolMemoryCost,
    codeInterpreterCpuCostDiff: comparisonCosts.codeInterpreterCpuCost - baselineCosts.codeInterpreterCpuCost,
    codeInterpreterMemoryCostDiff: comparisonCosts.codeInterpreterMemoryCost - baselineCosts.codeInterpreterMemoryCost,
    gatewayApiInvocationsCostDiff: comparisonCosts.gatewayApiInvocationsCost - baselineCosts.gatewayApiInvocationsCost,
    gatewaySearchApiCostDiff: comparisonCosts.gatewaySearchApiCost - baselineCosts.gatewaySearchApiCost,
    gatewayToolIndexingCostDiff: comparisonCosts.gatewayToolIndexingCost - baselineCosts.gatewayToolIndexingCost,
    identityTokenRequestsCostDiff: comparisonCosts.identityTokenRequestsCost - baselineCosts.identityTokenRequestsCost,
    memoryShortTermEventsCostDiff: comparisonCosts.memoryShortTermEventsCost - baselineCosts.memoryShortTermEventsCost,
    memoryLongTermStorageBuiltInCostDiff: comparisonCosts.memoryLongTermStorageBuiltInCost - baselineCosts.memoryLongTermStorageBuiltInCost,
    memoryLongTermStorageCustomCostDiff: comparisonCosts.memoryLongTermStorageCustomCost - baselineCosts.memoryLongTermStorageCustomCost,
    memoryLongTermRetrievalsCostDiff: comparisonCosts.memoryLongTermRetrievalsCost - baselineCosts.memoryLongTermRetrievalsCost,
    totalMonthlyCostDiff: comparisonCosts.totalMonthlyCost - baselineCosts.totalMonthlyCost,
  };
  
  const percentageChanges = {
    totalPercentageChange: baselineCosts.totalMonthlyCost > 0 
      ? (differences.totalMonthlyCostDiff / baselineCosts.totalMonthlyCost) * 100 
      : 0,
  };
  
  return {
    baseline: baselineCosts,
    comparison: comparisonCosts,
    differences,
    percentageChanges,
    summary: {
      isMoreExpensive: differences.totalMonthlyCostDiff > 0,
      costDifference: formatCurrency(Math.abs(differences.totalMonthlyCostDiff)),
      percentageChange: Math.abs(percentageChanges.totalPercentageChange).toFixed(1) + '%',
    }
  };
};

/**
 * Generate cost optimization suggestions based on usage patterns
 * @param usage - Current usage parameters
 * @returns Array of optimization suggestions
 */
export const generateOptimizationSuggestions = (usage: UsageParameters): string[] => {
  const suggestions: string[] = [];
  const costs = calculateCostBreakdown(usage);
  
  // Analyze CPU vs Memory usage patterns
  const totalCpuCost = costs.runtimeCpuCost + costs.browserToolCpuCost + costs.codeInterpreterCpuCost;
  const totalMemoryCost = costs.runtimeMemoryCost + costs.browserToolMemoryCost + costs.codeInterpreterMemoryCost;
  
  if (totalCpuCost > totalMemoryCost * 2) {
    suggestions.push('CPU costs are significantly higher than memory costs. Consider optimizing CPU-intensive operations or using more memory-efficient algorithms.');
  }
  
  if (totalMemoryCost > totalCpuCost * 2) {
    suggestions.push('Memory costs are significantly higher than CPU costs. Consider optimizing memory usage or using more CPU-efficient processing.');
  }
  
  // Analyze gateway usage efficiency
  if (usage.gatewaySearchApiInvocations > usage.gatewayApiInvocations * 2) {
    suggestions.push('High search API usage detected. Consider caching search results or optimizing search queries to reduce costs.');
  }
  
  // Analyze tool indexing patterns
  if (usage.gatewayToolIndexing > 1000) {
    suggestions.push('High tool indexing volume detected. Consider consolidating similar tools or implementing incremental indexing strategies.');
  }
  
  // Analyze identity token usage
  if (usage.identityTokenRequests > usage.gatewayApiInvocations) {
    suggestions.push('Identity token requests exceed gateway API calls. Consider implementing token caching or reuse strategies.');
  }
  
  // Analyze memory usage patterns
  const totalMemoryStorageCost = costs.memoryLongTermStorageBuiltInCost + costs.memoryLongTermStorageCustomCost;
  if (totalMemoryStorageCost > costs.totalMonthlyCost * 0.3) {
    suggestions.push('Memory storage costs represent more than 30% of your total bill. Consider optimizing memory retention policies or using more cost-effective storage strategies.');
  }
  
  if (usage.memoryLongTermRetrievals > usage.memoryShortTermEvents * 2) {
    suggestions.push('High memory retrieval ratio detected. Consider caching frequently accessed memories or optimizing retrieval patterns.');
  }
  
  if (usage.memoryLongTermStorageBuiltIn > usage.memoryLongTermStorageCustom * 3) {
    suggestions.push('Built-in memory storage is significantly higher than custom storage. Consider migrating to custom memory strategies for cost optimization.');
  }
  
  // General cost thresholds
  if (costs.totalMonthlyCost > 1000) {
    suggestions.push('Consider implementing usage monitoring and alerts to track cost trends and prevent unexpected charges.');
  }
  
  return suggestions;
};

/**
 * Calculate projected annual costs with growth assumptions
 * @param currentUsage - Current monthly usage parameters
 * @param growthRate - Monthly growth rate (e.g., 0.1 for 10% monthly growth)
 * @returns Projected costs for next 12 months
 */
export const calculateProjectedCosts = (currentUsage: UsageParameters, growthRate: number = 0) => {
  const monthlyProjections: Array<{ month: number; usage: UsageParameters; costs: CostBreakdown }> = [];
  
  for (let month = 1; month <= 12; month++) {
    const growthMultiplier = Math.pow(1 + growthRate, month - 1);
    
    const projectedUsage: UsageParameters = {
      runtimeCpuHours: Math.round(currentUsage.runtimeCpuHours * growthMultiplier),
      runtimeMemoryGBHours: Math.round(currentUsage.runtimeMemoryGBHours * growthMultiplier),
      browserToolCpuHours: Math.round(currentUsage.browserToolCpuHours * growthMultiplier),
      browserToolMemoryGBHours: Math.round(currentUsage.browserToolMemoryGBHours * growthMultiplier),
      codeInterpreterCpuHours: Math.round(currentUsage.codeInterpreterCpuHours * growthMultiplier),
      codeInterpreterMemoryGBHours: Math.round(currentUsage.codeInterpreterMemoryGBHours * growthMultiplier),
      gatewayApiInvocations: Math.round(currentUsage.gatewayApiInvocations * growthMultiplier),
      gatewaySearchApiInvocations: Math.round(currentUsage.gatewaySearchApiInvocations * growthMultiplier),
      gatewayToolIndexing: Math.round(currentUsage.gatewayToolIndexing * growthMultiplier),
      identityTokenRequests: Math.round(currentUsage.identityTokenRequests * growthMultiplier),
      memoryShortTermEvents: Math.round(currentUsage.memoryShortTermEvents * growthMultiplier),
      memoryLongTermStorageBuiltIn: Math.round(currentUsage.memoryLongTermStorageBuiltIn * growthMultiplier),
      memoryLongTermStorageCustom: Math.round(currentUsage.memoryLongTermStorageCustom * growthMultiplier),
      memoryLongTermRetrievals: Math.round(currentUsage.memoryLongTermRetrievals * growthMultiplier),
    };
    
    const projectedCosts = calculateCostBreakdown(sanitizeUsageParameters(projectedUsage));
    
    monthlyProjections.push({
      month,
      usage: projectedUsage,
      costs: projectedCosts,
    });
  }
  
  const totalAnnualCost = monthlyProjections.reduce((sum, projection) => sum + projection.costs.totalMonthlyCost, 0);
  
  return {
    monthlyProjections,
    totalAnnualCost,
    averageMonthlyCost: totalAnnualCost / 12,
  };
};

/**
 * Calculate break-even analysis for different usage levels
 * @param fixedCosts - Fixed monthly costs (e.g., infrastructure, personnel)
 * @param revenuePerInvocation - Revenue generated per agent invocation
 * @returns Break-even analysis
 */
export const calculateBreakEvenAnalysis = (fixedCosts: number, revenuePerInvocation: number) => {
  const findBreakEvenPoint = (targetProfit: number = 0): number => {
    // Binary search for break-even point
    let low = 0;
    let high = 10_000_000; // 10M invocations max search
    let iterations = 0;
    const maxIterations = 50;
    
    while (low < high && iterations < maxIterations) {
      const mid = Math.floor((low + high) / 2);
      const usage: UsageParameters = {
        runtimeCpuHours: mid * 0.1, // Assume 0.1 CPU hours per invocation
        runtimeMemoryGBHours: mid * 0.5, // Assume 0.5 GB-hours per invocation
        browserToolCpuHours: 0,
        browserToolMemoryGBHours: 0,
        codeInterpreterCpuHours: 0,
        codeInterpreterMemoryGBHours: 0,
        gatewayApiInvocations: mid,
        gatewaySearchApiInvocations: 0,
        gatewayToolIndexing: 0,
        identityTokenRequests: 0,
        memoryShortTermEvents: 0,
        memoryLongTermStorageBuiltIn: 0,
        memoryLongTermStorageCustom: 0,
        memoryLongTermRetrievals: 0,
      };
      
      const costs = calculateCostBreakdown(usage);
      const revenue = mid * revenuePerInvocation;
      const profit = revenue - costs.totalMonthlyCost - fixedCosts;
      
      if (Math.abs(profit - targetProfit) < 0.01) {
        return mid;
      }
      
      if (profit < targetProfit) {
        low = mid + 1;
      } else {
        high = mid;
      }
      
      iterations++;
    }
    
    return low;
  };
  
  const breakEvenInvocations = findBreakEvenPoint(0);
  const profitableAt10k = findBreakEvenPoint(10000); // $10k monthly profit
  
  return {
    breakEvenInvocations,
    profitableAt10k,
    monthlyFixedCosts: fixedCosts,
    revenuePerInvocation,
  };
};