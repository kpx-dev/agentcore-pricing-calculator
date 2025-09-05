/**
 * Input validation utilities for Bedrock AgentCore pricing calculator
 * Provides validation functions for numeric inputs, error message generation,
 * and input sanitization helpers.
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedValue?: number;
}

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  NOT_A_NUMBER: 'Please enter a valid number',
  NEGATIVE_NUMBER: 'Value must be zero or greater',
  TOO_LARGE: 'Value is too large (maximum: {max})',
  TOO_SMALL: 'Value is too small (minimum: {min})',
  INVALID_DECIMAL_PLACES: 'Maximum {places} decimal places allowed',
} as const;

/**
 * Validation constraints for different input types
 */
export const VALIDATION_CONSTRAINTS = {
  // Runtime consumption
  runtimeCpuHours: {
    min: 0,
    max: 100000, // 100k vCPU-hours
    maxDecimalPlaces: 2,
  },
  runtimeMemoryGBHours: {
    min: 0,
    max: 1000000, // 1M GB-hours
    maxDecimalPlaces: 2,
  },
  
  // Browser Tool consumption
  browserToolCpuHours: {
    min: 0,
    max: 100000, // 100k vCPU-hours
    maxDecimalPlaces: 2,
  },
  browserToolMemoryGBHours: {
    min: 0,
    max: 1000000, // 1M GB-hours
    maxDecimalPlaces: 2,
  },
  
  // Code Interpreter consumption
  codeInterpreterCpuHours: {
    min: 0,
    max: 100000, // 100k vCPU-hours
    maxDecimalPlaces: 2,
  },
  codeInterpreterMemoryGBHours: {
    min: 0,
    max: 1000000, // 1M GB-hours
    maxDecimalPlaces: 2,
  },
  
  // Gateway API invocations
  gatewayApiInvocations: {
    min: 0,
    max: 100000000, // 100 million
    maxDecimalPlaces: 0,
  },
  gatewaySearchApiInvocations: {
    min: 0,
    max: 100000000, // 100 million
    maxDecimalPlaces: 0,
  },
  gatewayToolIndexing: {
    min: 0,
    max: 100000, // 100k tools
    maxDecimalPlaces: 0,
  },
  
  // Identity token requests
  identityTokenRequests: {
    min: 0,
    max: 100000000, // 100 million
    maxDecimalPlaces: 0,
  },
  
  // Memory service parameters
  memoryShortTermEvents: {
    min: 0,
    max: 100000000, // 100 million events
    maxDecimalPlaces: 0,
  },
  memoryLongTermStorageBuiltIn: {
    min: 0,
    max: 100000000, // 100 million memories
    maxDecimalPlaces: 0,
  },
  memoryLongTermStorageCustom: {
    min: 0,
    max: 100000000, // 100 million memories
    maxDecimalPlaces: 0,
  },
  memoryLongTermRetrievals: {
    min: 0,
    max: 100000000, // 100 million retrievals
    maxDecimalPlaces: 0,
  },
} as const;

/**
 * Type for validation constraint keys
 */
export type ValidationConstraintKey = keyof typeof VALIDATION_CONSTRAINTS;

/**
 * Sanitizes string input to a number
 * Removes non-numeric characters except decimal point and handles edge cases
 */
export function sanitizeNumericInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove all characters except digits, decimal point, and leading minus
  let sanitized = input.replace(/[^0-9.-]/g, '');
  
  // Handle multiple decimal points - keep only the first one
  const decimalIndex = sanitized.indexOf('.');
  if (decimalIndex !== -1) {
    const beforeDecimal = sanitized.substring(0, decimalIndex + 1);
    const afterDecimal = sanitized.substring(decimalIndex + 1).replace(/\./g, '');
    sanitized = beforeDecimal + afterDecimal;
  }
  
  // Handle multiple minus signs - keep only if it's at the beginning
  if (sanitized.includes('-')) {
    const isNegative = sanitized.charAt(0) === '-';
    sanitized = sanitized.replace(/-/g, '');
    if (isNegative) {
      sanitized = '-' + sanitized;
    }
  }
  
  return sanitized;
}

/**
 * Converts string input to number with proper type checking
 */
export function parseNumericInput(input: string): number | null {
  const sanitized = sanitizeNumericInput(input);
  
  if (sanitized === '' || sanitized === '-' || sanitized === '.') {
    return null;
  }
  
  const parsed = parseFloat(sanitized);
  
  if (isNaN(parsed) || !isFinite(parsed)) {
    return null;
  }
  
  return parsed;
}

/**
 * Counts decimal places in a number
 */
export function countDecimalPlaces(value: number): number {
  if (Math.floor(value) === value) {
    return 0;
  }
  
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  
  if (decimalIndex === -1) {
    return 0;
  }
  
  return str.length - decimalIndex - 1;
}

/**
 * Validates a numeric input against constraints
 */
export function validateNumericInput(
  input: string,
  constraintKey: ValidationConstraintKey,
  isRequired: boolean = false
): ValidationResult {
  // Check if required field is empty
  if (isRequired && (!input || input.trim() === '')) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.REQUIRED,
    };
  }
  
  // Allow empty non-required fields
  if (!input || input.trim() === '') {
    return {
      isValid: true,
      sanitizedValue: 0,
    };
  }
  
  // Parse the input
  const parsedValue = parseNumericInput(input);
  
  if (parsedValue === null) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.NOT_A_NUMBER,
    };
  }
  
  const constraints = VALIDATION_CONSTRAINTS[constraintKey];
  
  // Check if negative (all our inputs should be non-negative)
  if (parsedValue < 0) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.NEGATIVE_NUMBER,
    };
  }
  
  // Check minimum value
  if (parsedValue < constraints.min) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.TOO_SMALL.replace('{min}', constraints.min.toString()),
    };
  }
  
  // Check maximum value
  if (parsedValue > constraints.max) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.TOO_LARGE.replace('{max}', constraints.max.toString()),
    };
  }
  
  // Check decimal places
  const decimalPlaces = countDecimalPlaces(parsedValue);
  if (decimalPlaces > constraints.maxDecimalPlaces) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.INVALID_DECIMAL_PLACES.replace(
        '{places}',
        constraints.maxDecimalPlaces.toString()
      ),
    };
  }
  
  return {
    isValid: true,
    sanitizedValue: parsedValue,
  };
}

/**
 * Validates all usage parameters at once
 */
export function validateUsageParameters(params: Record<string, string>): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedValues: Record<string, number>;
} {
  const errors: Record<string, string> = {};
  const sanitizedValues: Record<string, number> = {};
  let isValid = true;
  
  // Validate each parameter
  Object.keys(VALIDATION_CONSTRAINTS).forEach((key) => {
    const constraintKey = key as ValidationConstraintKey;
    const inputValue = params[key] || '';
    
    const result = validateNumericInput(inputValue, constraintKey, false);
    
    if (!result.isValid) {
      errors[key] = result.errorMessage!;
      isValid = false;
    } else {
      sanitizedValues[key] = result.sanitizedValue || 0;
    }
  });
  
  return {
    isValid,
    errors,
    sanitizedValues,
  };
}

/**
 * Real-time validation helper for form inputs
 * Returns validation state and formatted error message
 */
export function validateInputRealTime(
  value: string,
  constraintKey: ValidationConstraintKey,
  isRequired: boolean = false
): {
  isValid: boolean;
  errorMessage: string | null;
  sanitizedValue: number | null;
  showError: boolean;
} {
  const result = validateNumericInput(value, constraintKey, isRequired);
  
  // Don't show errors for empty non-required fields or while user is typing
  const showError = result.isValid === false && value.trim() !== '';
  
  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage || null,
    sanitizedValue: result.sanitizedValue !== undefined ? result.sanitizedValue : null,
    showError,
  };
}