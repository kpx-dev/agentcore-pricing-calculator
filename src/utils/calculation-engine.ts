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
    agentInvocationsCostDiff: comparisonCosts.agentInvocationsCost - baselineCosts.agentInvocationsCost,
    knowledgeBaseQueriesCostDiff: comparisonCosts.knowledgeBaseQueriesCost - baselineCosts.knowledgeBaseQueriesCost,
    actionGroupExecutionsCostDiff: comparisonCosts.actionGroupExecutionsCost - baselineCosts.actionGroupExecutionsCost,
    storageCostDiff: comparisonCosts.storageCost - baselineCosts.storageCost,
    dataIngestionCostDiff: comparisonCosts.dataIngestionCost - baselineCosts.dataIngestionCost,
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
  
  // Analyze storage costs
  if (costs.storageCost > costs.totalMonthlyCost * 0.5) {
    suggestions.push('Storage costs represent more than 50% of your total bill. Consider archiving unused data or optimizing your knowledge base structure.');
  }
  
  // Analyze data ingestion patterns
  if (usage.dataIngestionGB > usage.storageGB * 2) {
    suggestions.push('You are ingesting significantly more data than you store. Consider implementing data deduplication or filtering strategies.');
  }
  
  // Analyze query efficiency
  if (usage.knowledgeBaseQueries > usage.agentInvocations * 10) {
    suggestions.push('High knowledge base query ratio detected. Consider optimizing your agent logic to reduce redundant queries.');
  }
  
  // Analyze action group usage
  if (usage.actionGroupExecutions > usage.agentInvocations) {
    suggestions.push('Action group executions exceed agent invocations. Verify that your action groups are being called efficiently.');
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
      agentInvocations: Math.round(currentUsage.agentInvocations * growthMultiplier),
      knowledgeBaseQueries: Math.round(currentUsage.knowledgeBaseQueries * growthMultiplier),
      actionGroupExecutions: Math.round(currentUsage.actionGroupExecutions * growthMultiplier),
      storageGB: Math.round(currentUsage.storageGB * growthMultiplier),
      dataIngestionGB: Math.round(currentUsage.dataIngestionGB * growthMultiplier),
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
        agentInvocations: mid,
        knowledgeBaseQueries: 0,
        actionGroupExecutions: 0,
        storageGB: 0,
        dataIngestionGB: 0,
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