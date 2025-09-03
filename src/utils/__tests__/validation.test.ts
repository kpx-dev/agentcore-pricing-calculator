/**
 * Tests for input validation utilities
 */

import {
  sanitizeNumericInput,
  parseNumericInput,
  countDecimalPlaces,
  validateNumericInput,
  validateUsageParameters,
  validateInputRealTime,
  VALIDATION_MESSAGES,
  VALIDATION_CONSTRAINTS,
} from '../validation';

describe('sanitizeNumericInput', () => {
  it('should remove non-numeric characters', () => {
    expect(sanitizeNumericInput('abc123def')).toBe('123');
    expect(sanitizeNumericInput('$1,234.56')).toBe('1234.56');
    expect(sanitizeNumericInput('1a2b3c')).toBe('123');
  });

  it('should handle decimal points correctly', () => {
    expect(sanitizeNumericInput('123.45')).toBe('123.45');
    expect(sanitizeNumericInput('123.45.67')).toBe('123.4567');
    expect(sanitizeNumericInput('..123..')).toBe('.123');
  });

  it('should handle negative signs correctly', () => {
    expect(sanitizeNumericInput('-123')).toBe('-123');
    expect(sanitizeNumericInput('1-2-3')).toBe('123');
    expect(sanitizeNumericInput('-1-2-3')).toBe('-123');
  });

  it('should handle empty and invalid inputs', () => {
    expect(sanitizeNumericInput('')).toBe('');
    expect(sanitizeNumericInput('abc')).toBe('');
    expect(sanitizeNumericInput('!!!')).toBe('');
  });
});

describe('parseNumericInput', () => {
  it('should parse valid numeric strings', () => {
    expect(parseNumericInput('123')).toBe(123);
    expect(parseNumericInput('123.45')).toBe(123.45);
    expect(parseNumericInput('0')).toBe(0);
    expect(parseNumericInput('0.0')).toBe(0);
  });

  it('should return null for invalid inputs', () => {
    expect(parseNumericInput('')).toBe(null);
    expect(parseNumericInput('abc')).toBe(null);
    expect(parseNumericInput('-')).toBe(null);
    expect(parseNumericInput('.')).toBe(null);
  });

  it('should handle edge cases', () => {
    expect(parseNumericInput('123.0')).toBe(123);
    expect(parseNumericInput('000123')).toBe(123);
    expect(parseNumericInput('123.000')).toBe(123);
  });
});

describe('countDecimalPlaces', () => {
  it('should count decimal places correctly', () => {
    expect(countDecimalPlaces(123)).toBe(0);
    expect(countDecimalPlaces(123.4)).toBe(1);
    expect(countDecimalPlaces(123.45)).toBe(2);
    expect(countDecimalPlaces(123.456)).toBe(3);
  });

  it('should handle whole numbers', () => {
    expect(countDecimalPlaces(0)).toBe(0);
    expect(countDecimalPlaces(100)).toBe(0);
    expect(countDecimalPlaces(1000000)).toBe(0);
  });
});

describe('validateNumericInput', () => {
  it('should validate required fields', () => {
    const result = validateNumericInput('', 'agentInvocations', true);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(VALIDATION_MESSAGES.REQUIRED);
  });

  it('should allow empty non-required fields', () => {
    const result = validateNumericInput('', 'agentInvocations', false);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValue).toBe(0);
  });

  it('should reject non-numeric inputs', () => {
    const result = validateNumericInput('abc', 'agentInvocations');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(VALIDATION_MESSAGES.NOT_A_NUMBER);
  });

  it('should reject negative numbers', () => {
    const result = validateNumericInput('-123', 'agentInvocations');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(VALIDATION_MESSAGES.NEGATIVE_NUMBER);
  });

  it('should validate against maximum values', () => {
    const maxValue = VALIDATION_CONSTRAINTS.agentInvocations.max;
    const result = validateNumericInput((maxValue + 1).toString(), 'agentInvocations');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('too large');
  });

  it('should validate decimal places for storage inputs', () => {
    const result = validateNumericInput('123.456', 'storageGB');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('decimal places');
  });

  it('should accept valid inputs', () => {
    const result = validateNumericInput('1000', 'agentInvocations');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValue).toBe(1000);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should validate storage inputs with decimals', () => {
    const result = validateNumericInput('123.45', 'storageGB');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValue).toBe(123.45);
  });
});

describe('validateUsageParameters', () => {
  it('should validate all parameters successfully', () => {
    const params = {
      agentInvocations: '1000',
      knowledgeBaseQueries: '500',
      actionGroupExecutions: '200',
      storageGB: '10.5',
      dataIngestionGB: '5.25',
    };

    const result = validateUsageParameters(params);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
    expect(result.sanitizedValues.agentInvocations).toBe(1000);
    expect(result.sanitizedValues.storageGB).toBe(10.5);
  });

  it('should collect all validation errors', () => {
    const params = {
      agentInvocations: 'abc',
      knowledgeBaseQueries: '-100',
      actionGroupExecutions: '999999999999',
      storageGB: '123.456',
      dataIngestionGB: '',
    };

    const result = validateUsageParameters(params);
    expect(result.isValid).toBe(false);
    expect(result.errors.agentInvocations).toBe(VALIDATION_MESSAGES.NOT_A_NUMBER);
    expect(result.errors.knowledgeBaseQueries).toBe(VALIDATION_MESSAGES.NEGATIVE_NUMBER);
    expect(result.errors.actionGroupExecutions).toContain('too large');
    expect(result.errors.storageGB).toContain('decimal places');
    expect(result.sanitizedValues.dataIngestionGB).toBe(0); // Empty should default to 0
  });

  it('should handle missing parameters', () => {
    const params = {
      agentInvocations: '1000',
      // Missing other parameters
    };

    const result = validateUsageParameters(params);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValues.knowledgeBaseQueries).toBe(0);
    expect(result.sanitizedValues.storageGB).toBe(0);
  });
});

describe('validateInputRealTime', () => {
  it('should not show errors for empty non-required fields', () => {
    const result = validateInputRealTime('', 'agentInvocations', false);
    expect(result.isValid).toBe(true);
    expect(result.showError).toBe(false);
    expect(result.sanitizedValue).toBe(0);
  });

  it('should show errors for invalid inputs', () => {
    const result = validateInputRealTime('abc', 'agentInvocations', false);
    expect(result.isValid).toBe(false);
    expect(result.showError).toBe(true);
    expect(result.errorMessage).toBe(VALIDATION_MESSAGES.NOT_A_NUMBER);
  });

  it('should show errors for required empty fields', () => {
    const result = validateInputRealTime('', 'agentInvocations', true);
    expect(result.isValid).toBe(false);
    expect(result.showError).toBe(false); // Don't show error for empty field while typing
  });

  it('should provide sanitized values for valid inputs', () => {
    const result = validateInputRealTime('1000', 'agentInvocations', false);
    expect(result.isValid).toBe(true);
    expect(result.showError).toBe(false);
    expect(result.sanitizedValue).toBe(1000);
    expect(result.errorMessage).toBe(null);
  });
});