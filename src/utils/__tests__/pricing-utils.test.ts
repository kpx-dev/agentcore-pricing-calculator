/**
 * Tests for pricing calculation utilities
 */

import {
  calculateAgentInvocationsCost,
  calculateKnowledgeBaseQueriesCost,
  calculateActionGroupExecutionsCost,
  calculateStorageCost,
  calculateDataIngestionCost,
  calculateCostBreakdown,
  calculateTieredCost,
  formatCurrency,
  formatLargeNumber,
  sanitizeUsageParameters,
  validateCostBreakdown,
  roundToPrecision,
} from '../pricing-utils';
import { UsageParameters } from '../../types';
import { BEDROCK_AGENTCORE_PRICING } from '../../config/pricing-config';

describe('Individual Cost Calculations', () => {
  test('calculateAgentInvocationsCost', () => {
    expect(calculateAgentInvocationsCost(1000, 0.00025)).toBe(0.00025);
    expect(calculateAgentInvocationsCost(10000, 0.00025)).toBe(0.0025);
    expect(calculateAgentInvocationsCost(0, 0.00025)).toBe(0);
    expect(calculateAgentInvocationsCost(-100, 0.00025)).toBe(0);
  });

  test('calculateKnowledgeBaseQueriesCost', () => {
    expect(calculateKnowledgeBaseQueriesCost(1000, 0.0004)).toBe(0.0004);
    expect(calculateKnowledgeBaseQueriesCost(5000, 0.0004)).toBe(0.002);
    expect(calculateKnowledgeBaseQueriesCost(0, 0.0004)).toBe(0);
    expect(calculateKnowledgeBaseQueriesCost(-100, 0.0004)).toBe(0);
  });

  test('calculateActionGroupExecutionsCost', () => {
    expect(calculateActionGroupExecutionsCost(1000, 0.00035)).toBe(0.00035);
    expect(calculateActionGroupExecutionsCost(2000, 0.00035)).toBe(0.0007);
    expect(calculateActionGroupExecutionsCost(0, 0.00035)).toBe(0);
    expect(calculateActionGroupExecutionsCost(-100, 0.00035)).toBe(0);
  });

  test('calculateStorageCost', () => {
    expect(calculateStorageCost(10, 0.10)).toBe(1.0);
    expect(calculateStorageCost(100, 0.10)).toBe(10.0);
    expect(calculateStorageCost(0, 0.10)).toBe(0);
    expect(calculateStorageCost(-10, 0.10)).toBe(0);
  });

  test('calculateDataIngestionCost', () => {
    expect(calculateDataIngestionCost(5, 0.20)).toBe(1.0);
    expect(calculateDataIngestionCost(10, 0.20)).toBe(2.0);
    expect(calculateDataIngestionCost(0, 0.20)).toBe(0);
    expect(calculateDataIngestionCost(-5, 0.20)).toBe(0);
  });
});

describe('Cost Breakdown Calculation', () => {
  test('calculateCostBreakdown with sample usage', () => {
    const usage: UsageParameters = {
      agentInvocations: 10000,
      knowledgeBaseQueries: 5000,
      actionGroupExecutions: 2000,
      storageGB: 10,
      dataIngestionGB: 5,
    };

    const breakdown = calculateCostBreakdown(usage);

    expect(breakdown.agentInvocationsCost).toBe(0.0025);
    expect(breakdown.knowledgeBaseQueriesCost).toBe(0.002);
    expect(breakdown.actionGroupExecutionsCost).toBe(0.0007);
    expect(breakdown.storageCost).toBe(1.0);
    expect(breakdown.dataIngestionCost).toBe(1.0);
    expect(breakdown.totalMonthlyCost).toBe(2.0052);
  });

  test('calculateCostBreakdown with zero usage', () => {
    const usage: UsageParameters = {
      agentInvocations: 0,
      knowledgeBaseQueries: 0,
      actionGroupExecutions: 0,
      storageGB: 0,
      dataIngestionGB: 0,
    };

    const breakdown = calculateCostBreakdown(usage);

    expect(breakdown.agentInvocationsCost).toBe(0);
    expect(breakdown.knowledgeBaseQueriesCost).toBe(0);
    expect(breakdown.actionGroupExecutionsCost).toBe(0);
    expect(breakdown.storageCost).toBe(0);
    expect(breakdown.dataIngestionCost).toBe(0);
    expect(breakdown.totalMonthlyCost).toBe(0);
  });

  test('calculateCostBreakdown with custom rates', () => {
    const usage: UsageParameters = {
      agentInvocations: 1000,
      knowledgeBaseQueries: 0,
      actionGroupExecutions: 0,
      storageGB: 0,
      dataIngestionGB: 0,
    };

    const customRates = { agentInvocationRate: 0.001 };
    const breakdown = calculateCostBreakdown(usage, customRates);

    expect(breakdown.agentInvocationsCost).toBe(0.001);
  });
});

describe('Tiered Pricing', () => {
  test('calculateTieredCost with single tier', () => {
    const tiers = [{ threshold: 0, rate: 0.001 }];
    expect(calculateTieredCost(1000, tiers)).toBe(0.001);
    expect(calculateTieredCost(5000, tiers)).toBe(0.005);
  });

  test('calculateTieredCost with multiple tiers', () => {
    const tiers = [
      { threshold: 0, rate: 0.001 },
      { threshold: 1000, rate: 0.0008 },
      { threshold: 5000, rate: 0.0006 },
    ];
    
    // Usage within first tier
    expect(calculateTieredCost(500, tiers)).toBe(0.0005);
    
    // Usage spanning multiple tiers
    const result = calculateTieredCost(6000, tiers);
    // First 1000: 1000 * 0.001 / 1000 = 0.001
    // Next 4000: 4000 * 0.0008 / 1000 = 0.0032
    // Next 1000: 1000 * 0.0006 / 1000 = 0.0006
    // Total: 0.001 + 0.0032 + 0.0006 = 0.0048
    expect(result).toBeCloseTo(0.0048, 6);
  });

  test('calculateTieredCost edge cases', () => {
    const tiers = [{ threshold: 0, rate: 0.001 }];
    expect(calculateTieredCost(0, tiers)).toBe(0);
    expect(calculateTieredCost(-100, tiers)).toBe(0);
    expect(calculateTieredCost(1000, [])).toBe(0);
  });
});

describe('Currency Formatting', () => {
  test('formatCurrency basic formatting', () => {
    expect(formatCurrency(1.23)).toBe('$1.23');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(0.001)).toBe('$0.00');
    expect(formatCurrency(0.005)).toBe('$0.01');
  });

  test('formatCurrency with options', () => {
    expect(formatCurrency(1.23456, { precision: 4 })).toBe('$1.2346');
    expect(formatCurrency(1234.56, { showCents: false })).toBe('$1,235');
  });

  test('formatCurrency edge cases', () => {
    expect(formatCurrency(NaN)).toBe('$0.00');
    expect(formatCurrency(Infinity)).toBe('$0.00');
    expect(formatCurrency(-Infinity)).toBe('$0.00');
    expect(formatCurrency(-1.23)).toBe('-$1.23');
  });
});

describe('Number Formatting', () => {
  test('formatLargeNumber', () => {
    expect(formatLargeNumber(500)).toBe('500');
    expect(formatLargeNumber(1500)).toBe('1.5K');
    expect(formatLargeNumber(1500000)).toBe('1.5M');
    expect(formatLargeNumber(1500000000)).toBe('1.5B');
    expect(formatLargeNumber(-1500)).toBe('-1.5K');
  });

  test('formatLargeNumber edge cases', () => {
    expect(formatLargeNumber(NaN)).toBe('0');
    expect(formatLargeNumber(Infinity)).toBe('0');
    expect(formatLargeNumber(0)).toBe('0');
  });
});

describe('Utility Functions', () => {
  test('roundToPrecision', () => {
    expect(roundToPrecision(1.23456, 2)).toBe(1.23);
    expect(roundToPrecision(1.23556, 2)).toBe(1.24);
    expect(roundToPrecision(1.235, 2)).toBe(1.24);
  });

  test('sanitizeUsageParameters', () => {
    const input = {
      agentInvocations: 1000,
      knowledgeBaseQueries: -100, // Should be clamped to 0
      actionGroupExecutions: NaN, // Should be set to 0
      storageGB: Infinity, // Should be set to 0
      // dataIngestionGB missing - should use default
    };

    const result = sanitizeUsageParameters(input);

    expect(result.agentInvocations).toBe(1000);
    expect(result.knowledgeBaseQueries).toBe(0);
    expect(result.actionGroupExecutions).toBe(0);
    expect(result.storageGB).toBe(0);
    expect(result.dataIngestionGB).toBe(0);
  });

  test('validateCostBreakdown', () => {
    const validBreakdown = {
      agentInvocationsCost: 1.0,
      knowledgeBaseQueriesCost: 2.0,
      actionGroupExecutionsCost: 0.5,
      storageCost: 10.0,
      dataIngestionCost: 5.0,
      totalMonthlyCost: 18.5,
    };

    const result = validateCostBreakdown(validBreakdown);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);

    const invalidBreakdown = {
      ...validBreakdown,
      agentInvocationsCost: -1.0, // Negative cost
      totalMonthlyCost: NaN, // Invalid value
    };

    const invalidResult = validateCostBreakdown(invalidBreakdown);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.warnings.length).toBeGreaterThan(0);
  });
});