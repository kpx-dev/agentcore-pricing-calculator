/**
 * Examples demonstrating the Bedrock AgentCore pricing calculation engine
 * 
 * These examples show how to use the various calculation functions
 * for different scenarios and use cases.
 */

import { UsageParameters } from '../../types';
import {
  calculateCostBreakdown,
  formatCurrency,
  sanitizeUsageParameters,
  validateCostBreakdown,
  getPricingMetadata,
} from '../pricing-utils';
import {
  calculateBatchCosts,
  compareScenarios,
  generateOptimizationSuggestions,
  calculateProjectedCosts,
} from '../calculation-engine';

/**
 * Example 1: Basic cost calculation for a small application
 */
export const basicCalculationExample = () => {
  console.log('=== Basic Cost Calculation Example ===');
  
  const usage: UsageParameters = {
    runtimeCpuHours: 100,         // 100 vCPU-hours for runtime
    runtimeMemoryGBHours: 500,    // 500 GB-hours for runtime memory
    browserToolCpuHours: 50,      // 50 vCPU-hours for browser tool
    browserToolMemoryGBHours: 250, // 250 GB-hours for browser tool memory
    codeInterpreterCpuHours: 30,  // 30 vCPU-hours for code interpreter
    codeInterpreterMemoryGBHours: 150, // 150 GB-hours for code interpreter memory
    gatewayApiInvocations: 10000, // 10K gateway API calls
    gatewaySearchApiInvocations: 5000, // 5K search API calls
    gatewayToolIndexing: 100,     // 100 tools indexed
    identityTokenRequests: 2000,  // 2K identity token requests
    memoryShortTermEvents: 5000,  // 5K memory events
    memoryLongTermStorageBuiltIn: 1000, // 1K built-in memories
    memoryLongTermStorageCustom: 500, // 500 custom memories
    memoryLongTermRetrievals: 2000, // 2K memory retrievals
  };
  
  const costs = calculateCostBreakdown(usage);
  const validation = validateCostBreakdown(costs);
  
  console.log('Usage Parameters:', usage);
  console.log('Cost Breakdown:');
  console.log(`  Runtime CPU: ${formatCurrency(costs.runtimeCpuCost)}`);
  console.log(`  Runtime Memory: ${formatCurrency(costs.runtimeMemoryCost)}`);
  console.log(`  Browser Tool CPU: ${formatCurrency(costs.browserToolCpuCost)}`);
  console.log(`  Browser Tool Memory: ${formatCurrency(costs.browserToolMemoryCost)}`);
  console.log(`  Code Interpreter CPU: ${formatCurrency(costs.codeInterpreterCpuCost)}`);
  console.log(`  Code Interpreter Memory: ${formatCurrency(costs.codeInterpreterMemoryCost)}`);
  console.log(`  Gateway API Invocations: ${formatCurrency(costs.gatewayApiInvocationsCost)}`);
  console.log(`  Gateway Search API: ${formatCurrency(costs.gatewaySearchApiCost)}`);
  console.log(`  Gateway Tool Indexing: ${formatCurrency(costs.gatewayToolIndexingCost)}`);
  console.log(`  Identity Token Requests: ${formatCurrency(costs.identityTokenRequestsCost)}`);
  console.log(`  Memory Short-Term Events: ${formatCurrency(costs.memoryShortTermEventsCost)}`);
  console.log(`  Memory Long-Term Storage (Built-in): ${formatCurrency(costs.memoryLongTermStorageBuiltInCost)}`);
  console.log(`  Memory Long-Term Storage (Custom): ${formatCurrency(costs.memoryLongTermStorageCustomCost)}`);
  console.log(`  Memory Long-Term Retrievals: ${formatCurrency(costs.memoryLongTermRetrievalsCost)}`);
  console.log(`  Total Monthly Cost: ${formatCurrency(costs.totalMonthlyCost)}`);
  console.log('Validation:', validation.isValid ? 'Valid' : 'Invalid');
  if (validation.warnings.length > 0) {
    console.log('Warnings:', validation.warnings);
  }
  console.log('');
};

/**
 * Example 2: Comparing different usage scenarios
 */
export const scenarioComparisonExample = () => {
  console.log('=== Scenario Comparison Example ===');
  
  const currentUsage: UsageParameters = {
    runtimeCpuHours: 500,
    runtimeMemoryGBHours: 2500,
    browserToolCpuHours: 250,
    browserToolMemoryGBHours: 1250,
    codeInterpreterCpuHours: 150,
    codeInterpreterMemoryGBHours: 750,
    gatewayApiInvocations: 50000,
    gatewaySearchApiInvocations: 25000,
    gatewayToolIndexing: 500,
    identityTokenRequests: 10000,
    memoryShortTermEvents: 25000,
    memoryLongTermStorageBuiltIn: 5000,
    memoryLongTermStorageCustom: 2500,
    memoryLongTermRetrievals: 10000,
  };
  
  const scaledUsage: UsageParameters = {
    runtimeCpuHours: 1000,        // Double the CPU hours
    runtimeMemoryGBHours: 5000,   // Double the memory hours
    browserToolCpuHours: 500,     // Double the browser tool CPU
    browserToolMemoryGBHours: 2500, // Double the browser tool memory
    codeInterpreterCpuHours: 300, // Double the code interpreter CPU
    codeInterpreterMemoryGBHours: 1500, // Double the code interpreter memory
    gatewayApiInvocations: 100000, // Double the API invocations
    gatewaySearchApiInvocations: 50000, // Double the search API calls
    gatewayToolIndexing: 1000,    // Double the tool indexing
    identityTokenRequests: 20000, // Double the token requests
    memoryShortTermEvents: 50000, // Double the memory events
    memoryLongTermStorageBuiltIn: 10000, // Double the built-in memories
    memoryLongTermStorageCustom: 5000, // Double the custom memories
    memoryLongTermRetrievals: 20000, // Double the memory retrievals
  };
  
  const comparison = compareScenarios(currentUsage, scaledUsage);
  
  console.log('Current Usage Cost:', formatCurrency(comparison.baseline.totalMonthlyCost));
  console.log('Scaled Usage Cost:', formatCurrency(comparison.comparison.totalMonthlyCost));
  console.log('Cost Difference:', comparison.summary.costDifference);
  console.log('Percentage Change:', comparison.summary.percentageChange);
  console.log('Is More Expensive:', comparison.summary.isMoreExpensive);
  console.log('');
};

/**
 * Example 3: Batch calculations for multiple scenarios
 */
export const batchCalculationExample = () => {
  console.log('=== Batch Calculation Example ===');
  
  const scenarios: UsageParameters[] = [
    // Light usage
    {
      runtimeCpuHours: 10,
      runtimeMemoryGBHours: 50,
      browserToolCpuHours: 5,
      browserToolMemoryGBHours: 25,
      codeInterpreterCpuHours: 3,
      codeInterpreterMemoryGBHours: 15,
      gatewayApiInvocations: 1000,
      gatewaySearchApiInvocations: 500,
      gatewayToolIndexing: 10,
      identityTokenRequests: 200,
      memoryShortTermEvents: 1000,
      memoryLongTermStorageBuiltIn: 100,
      memoryLongTermStorageCustom: 50,
      memoryLongTermRetrievals: 200,
    },
    // Medium usage
    {
      runtimeCpuHours: 250,
      runtimeMemoryGBHours: 1250,
      browserToolCpuHours: 125,
      browserToolMemoryGBHours: 625,
      codeInterpreterCpuHours: 75,
      codeInterpreterMemoryGBHours: 375,
      gatewayApiInvocations: 25000,
      gatewaySearchApiInvocations: 12500,
      gatewayToolIndexing: 250,
      identityTokenRequests: 5000,
      memoryShortTermEvents: 12500,
      memoryLongTermStorageBuiltIn: 2500,
      memoryLongTermStorageCustom: 1250,
      memoryLongTermRetrievals: 5000,
    },
    // Heavy usage
    {
      runtimeCpuHours: 1000,
      runtimeMemoryGBHours: 5000,
      browserToolCpuHours: 500,
      browserToolMemoryGBHours: 2500,
      codeInterpreterCpuHours: 300,
      codeInterpreterMemoryGBHours: 1500,
      gatewayApiInvocations: 100000,
      gatewaySearchApiInvocations: 50000,
      gatewayToolIndexing: 1000,
      identityTokenRequests: 20000,
      memoryShortTermEvents: 50000,
      memoryLongTermStorageBuiltIn: 10000,
      memoryLongTermStorageCustom: 5000,
      memoryLongTermRetrievals: 20000,
    },
  ];
  
  const results = calculateBatchCosts(scenarios);
  
  scenarios.forEach((scenario, index) => {
    const cost = results[index];
    console.log(`Scenario ${index + 1} (${index === 0 ? 'Light' : index === 1 ? 'Medium' : 'Heavy'} Usage):`);
    console.log(`  Monthly Cost: ${formatCurrency(cost.totalMonthlyCost)}`);
    console.log(`  Gateway API Invocations: ${scenario.gatewayApiInvocations.toLocaleString()}`);
  });
  console.log('');
};

/**
 * Example 4: Cost optimization suggestions
 */
export const optimizationExample = () => {
  console.log('=== Cost Optimization Example ===');
  
  const inefficientUsage: UsageParameters = {
    runtimeCpuHours: 100,
    runtimeMemoryGBHours: 5000,    // Very high memory usage
    browserToolCpuHours: 500,      // High browser tool usage
    browserToolMemoryGBHours: 2500,
    codeInterpreterCpuHours: 300,
    codeInterpreterMemoryGBHours: 1500,
    gatewayApiInvocations: 10000,
    gatewaySearchApiInvocations: 150000, // Very high search API usage
    gatewayToolIndexing: 5000,     // High tool indexing
    identityTokenRequests: 50000,  // High token requests
    memoryShortTermEvents: 100000, // Very high memory events
    memoryLongTermStorageBuiltIn: 50000, // High built-in memory storage
    memoryLongTermStorageCustom: 25000, // High custom memory storage
    memoryLongTermRetrievals: 75000, // Very high memory retrievals
  };
  
  const costs = calculateCostBreakdown(inefficientUsage);
  const suggestions = generateOptimizationSuggestions(inefficientUsage);
  
  console.log('Current Monthly Cost:', formatCurrency(costs.totalMonthlyCost));
  console.log('Optimization Suggestions:');
  suggestions.forEach((suggestion, index) => {
    console.log(`  ${index + 1}. ${suggestion}`);
  });
  console.log('');
};

/**
 * Example 5: Projected costs with growth
 */
export const projectionExample = () => {
  console.log('=== Cost Projection Example ===');
  
  const currentUsage: UsageParameters = {
    runtimeCpuHours: 100,
    runtimeMemoryGBHours: 500,
    browserToolCpuHours: 50,
    browserToolMemoryGBHours: 250,
    codeInterpreterCpuHours: 30,
    codeInterpreterMemoryGBHours: 150,
    gatewayApiInvocations: 10000,
    gatewaySearchApiInvocations: 5000,
    gatewayToolIndexing: 100,
    identityTokenRequests: 2000,
    memoryShortTermEvents: 5000,
    memoryLongTermStorageBuiltIn: 1000,
    memoryLongTermStorageCustom: 500,
    memoryLongTermRetrievals: 2000,
  };
  
  const growthRate = 0.15; // 15% monthly growth
  const projections = calculateProjectedCosts(currentUsage, growthRate);
  
  console.log(`Current Monthly Cost: ${formatCurrency(projections.monthlyProjections[0].costs.totalMonthlyCost)}`);
  console.log(`Projected Cost in 6 months: ${formatCurrency(projections.monthlyProjections[5].costs.totalMonthlyCost)}`);
  console.log(`Projected Cost in 12 months: ${formatCurrency(projections.monthlyProjections[11].costs.totalMonthlyCost)}`);
  console.log(`Total Annual Cost: ${formatCurrency(projections.totalAnnualCost)}`);
  console.log(`Average Monthly Cost: ${formatCurrency(projections.averageMonthlyCost)}`);
  console.log('');
};

/**
 * Example 6: Input validation and sanitization
 */
export const validationExample = () => {
  console.log('=== Input Validation Example ===');
  
  const invalidInput = {
    runtimeCpuHours: -100,        // Negative value
    runtimeMemoryGBHours: NaN,    // Invalid number
    browserToolCpuHours: Infinity, // Invalid number
    browserToolMemoryGBHours: 250, // Valid value
    codeInterpreterCpuHours: 30,  // Valid value
    codeInterpreterMemoryGBHours: 150, // Valid value
    gatewayApiInvocations: 10000, // Valid value
    gatewaySearchApiInvocations: 5000, // Valid value
    gatewayToolIndexing: 100,     // Valid value
    identityTokenRequests: 2000,  // Valid value
    memoryShortTermEvents: 5000,  // Valid value
    memoryLongTermStorageBuiltIn: 1000, // Valid value
    memoryLongTermStorageCustom: 500, // Valid value
    // memoryLongTermRetrievals missing // Missing value
  };
  
  console.log('Raw Input:', invalidInput);
  
  const sanitized = sanitizeUsageParameters(invalidInput);
  console.log('Sanitized Input:', sanitized);
  
  const costs = calculateCostBreakdown(sanitized);
  console.log('Calculated Cost:', formatCurrency(costs.totalMonthlyCost));
  console.log('');
};

/**
 * Example 7: Pricing metadata and configuration
 */
export const metadataExample = () => {
  console.log('=== Pricing Metadata Example ===');
  
  const metadata = getPricingMetadata();
  console.log('Pricing Information:');
  console.log(`  Last Updated: ${new Date(metadata.lastUpdated).toLocaleDateString()}`);
  console.log(`  Source: ${metadata.sourceUrl}`);
  console.log(`  Region: ${metadata.region}`);
  console.log('');
};

/**
 * Run all examples
 */
export const runAllExamples = () => {
  console.log('Bedrock AgentCore Pricing Calculator Examples');
  console.log('=============================================');
  console.log('');
  
  basicCalculationExample();
  scenarioComparisonExample();
  batchCalculationExample();
  optimizationExample();
  projectionExample();
  validationExample();
  metadataExample();
  
  console.log('All examples completed!');
};

// Note: Individual examples are already exported above