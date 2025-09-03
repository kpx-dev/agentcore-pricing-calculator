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
    agentInvocations: 10000,      // 10K agent calls per month
    knowledgeBaseQueries: 5000,   // 5K knowledge base queries
    actionGroupExecutions: 2000,  // 2K action executions
    storageGB: 10,                // 10GB of knowledge base storage
    dataIngestionGB: 2,           // 2GB of new data ingested
  };
  
  const costs = calculateCostBreakdown(usage);
  const validation = validateCostBreakdown(costs);
  
  console.log('Usage Parameters:', usage);
  console.log('Cost Breakdown:');
  console.log(`  Agent Invocations: ${formatCurrency(costs.agentInvocationsCost)}`);
  console.log(`  Knowledge Base Queries: ${formatCurrency(costs.knowledgeBaseQueriesCost)}`);
  console.log(`  Action Group Executions: ${formatCurrency(costs.actionGroupExecutionsCost)}`);
  console.log(`  Storage: ${formatCurrency(costs.storageCost)}`);
  console.log(`  Data Ingestion: ${formatCurrency(costs.dataIngestionCost)}`);
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
    agentInvocations: 50000,
    knowledgeBaseQueries: 25000,
    actionGroupExecutions: 10000,
    storageGB: 50,
    dataIngestionGB: 5,
  };
  
  const scaledUsage: UsageParameters = {
    agentInvocations: 100000,     // Double the invocations
    knowledgeBaseQueries: 50000,  // Double the queries
    actionGroupExecutions: 20000, // Double the executions
    storageGB: 100,               // Double the storage
    dataIngestionGB: 10,          // Double the ingestion
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
      agentInvocations: 1000,
      knowledgeBaseQueries: 500,
      actionGroupExecutions: 200,
      storageGB: 1,
      dataIngestionGB: 0.5,
    },
    // Medium usage
    {
      agentInvocations: 25000,
      knowledgeBaseQueries: 12500,
      actionGroupExecutions: 5000,
      storageGB: 25,
      dataIngestionGB: 5,
    },
    // Heavy usage
    {
      agentInvocations: 100000,
      knowledgeBaseQueries: 50000,
      actionGroupExecutions: 20000,
      storageGB: 100,
      dataIngestionGB: 20,
    },
  ];
  
  const results = calculateBatchCosts(scenarios);
  
  scenarios.forEach((scenario, index) => {
    const cost = results[index];
    console.log(`Scenario ${index + 1} (${index === 0 ? 'Light' : index === 1 ? 'Medium' : 'Heavy'} Usage):`);
    console.log(`  Monthly Cost: ${formatCurrency(cost.totalMonthlyCost)}`);
    console.log(`  Agent Invocations: ${scenario.agentInvocations.toLocaleString()}`);
  });
  console.log('');
};

/**
 * Example 4: Cost optimization suggestions
 */
export const optimizationExample = () => {
  console.log('=== Cost Optimization Example ===');
  
  const inefficientUsage: UsageParameters = {
    agentInvocations: 10000,
    knowledgeBaseQueries: 150000,  // Very high query ratio
    actionGroupExecutions: 15000,  // More executions than invocations
    storageGB: 500,                // High storage costs
    dataIngestionGB: 1200,         // Ingesting more than storing
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
    agentInvocations: 10000,
    knowledgeBaseQueries: 5000,
    actionGroupExecutions: 2000,
    storageGB: 10,
    dataIngestionGB: 2,
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
    agentInvocations: -1000,      // Negative value
    knowledgeBaseQueries: NaN,    // Invalid number
    actionGroupExecutions: Infinity, // Invalid number
    storageGB: 10,                // Valid value
    // dataIngestionGB missing      // Missing value
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