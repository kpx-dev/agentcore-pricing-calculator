import React, { useState, useCallback, useEffect } from 'react';
import { UsageParameters } from '../types';
import { validateInputRealTime, ValidationConstraintKey } from '../utils/validation';
import './UsageInputForm.css';

/**
 * Props for the UsageInputForm component
 */
interface UsageInputFormProps {
  /**
   * Current usage parameters
   */
  usageParameters: UsageParameters;
  
  /**
   * Callback function called when usage parameters change
   * Debounced to avoid excessive calculations
   */
  onUsageChange: (parameters: UsageParameters) => void;
  
  /**
   * Whether the form is disabled (e.g., during calculations)
   */
  disabled?: boolean;
}

/**
 * Input field configuration for form generation
 */
interface InputFieldConfig {
  key: keyof UsageParameters;
  label: string;
  placeholder: string;
  description: string;
  unit: string;
  constraintKey: ValidationConstraintKey;
}

/**
 * Configuration for all input fields
 */
const INPUT_FIELDS: InputFieldConfig[] = [
  {
    key: 'agentInvocations',
    label: 'Agent Invocations',
    placeholder: '10000',
    description: 'Number of agent invocations per month',
    unit: 'invocations/month',
    constraintKey: 'agentInvocations',
  },
  {
    key: 'knowledgeBaseQueries',
    label: 'Knowledge Base Queries',
    placeholder: '5000',
    description: 'Number of knowledge base queries per month',
    unit: 'queries/month',
    constraintKey: 'knowledgeBaseQueries',
  },
  {
    key: 'actionGroupExecutions',
    label: 'Action Group Executions',
    placeholder: '2000',
    description: 'Number of action group executions per month',
    unit: 'executions/month',
    constraintKey: 'actionGroupExecutions',
  },
  {
    key: 'storageGB',
    label: 'Knowledge Base Storage',
    placeholder: '10.5',
    description: 'Amount of data stored in knowledge bases',
    unit: 'GB',
    constraintKey: 'storageGB',
  },
  {
    key: 'dataIngestionGB',
    label: 'Data Ingestion',
    placeholder: '5.2',
    description: 'Amount of data ingested into knowledge bases',
    unit: 'GB',
    constraintKey: 'dataIngestionGB',
  },
];

/**
 * Custom hook for debounced value updates
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * UsageInputForm Component
 * 
 * Provides input fields for all Bedrock AgentCore usage parameters with:
 * - Real-time validation and error display
 * - Debounced input handling for performance
 * - Controlled inputs with proper state management
 * - Accessible form design with proper labels and descriptions
 */
export const UsageInputForm: React.FC<UsageInputFormProps> = ({
  usageParameters,
  onUsageChange,
  disabled = false,
}) => {
  // Local state for input values (as strings for controlled inputs)
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    INPUT_FIELDS.forEach(field => {
      initialValues[field.key] = usageParameters[field.key].toString();
    });
    return initialValues;
  });

  // Local state for validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Debounced input values for triggering parent updates
  const debouncedInputValues = useDebounce(inputValues, 300);

  // Update parent component when debounced values change
  useEffect(() => {
    const newParameters: UsageParameters = {
      agentInvocations: 0,
      knowledgeBaseQueries: 0,
      actionGroupExecutions: 0,
      storageGB: 0,
      dataIngestionGB: 0,
    };

    let hasValidValues = false;

    // Validate and convert all input values
    INPUT_FIELDS.forEach(field => {
      const inputValue = debouncedInputValues[field.key] || '';
      const validation = validateInputRealTime(inputValue, field.constraintKey, false);
      
      if (validation.isValid && validation.sanitizedValue !== null) {
        newParameters[field.key] = validation.sanitizedValue;
        hasValidValues = true;
      }
    });

    // Only trigger update if we have valid values
    if (hasValidValues) {
      onUsageChange(newParameters);
    }
  }, [debouncedInputValues, onUsageChange]);

  // Handle input changes with real-time validation
  const handleInputChange = useCallback((fieldKey: string, value: string) => {
    const field = INPUT_FIELDS.find(f => f.key === fieldKey);
    if (!field) return;

    // Update input value
    setInputValues(prev => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Validate input and update errors
    const validation = validateInputRealTime(value, field.constraintKey, false);
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      if (validation.showError && validation.errorMessage) {
        newErrors[fieldKey] = validation.errorMessage;
      } else {
        delete newErrors[fieldKey];
      }
      
      return newErrors;
    });
  }, []);

  // Handle input blur for additional validation
  const handleInputBlur = useCallback((fieldKey: string) => {
    const field = INPUT_FIELDS.find(f => f.key === fieldKey);
    if (!field) return;

    const value = inputValues[fieldKey] || '';
    const validation = validateInputRealTime(value, field.constraintKey, false);
    
    // Show validation errors on blur even for empty fields
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      if (!validation.isValid && validation.errorMessage) {
        newErrors[fieldKey] = validation.errorMessage;
      } else {
        delete newErrors[fieldKey];
      }
      
      return newErrors;
    });
  }, [inputValues]);

  return (
    <div className="usage-input-form">
      <div className="form-header">
        <h2>Usage Parameters</h2>
        <p className="form-description">
          Enter your expected monthly usage to calculate estimated costs for AWS Bedrock AgentCore services.
        </p>
      </div>

      <form className="input-form" onSubmit={(e) => e.preventDefault()}>
        {INPUT_FIELDS.map((field) => {
          const hasError = validationErrors[field.key];
          const inputValue = inputValues[field.key] || '';

          return (
            <div key={field.key} className={`input-group ${hasError ? 'has-error' : ''}`}>
              <label htmlFor={field.key} className="input-label">
                {field.label}
                <span className="input-unit">({field.unit})</span>
              </label>
              
              <input
                id={field.key}
                type="text"
                className="input-field"
                value={inputValue}
                placeholder={field.placeholder}
                disabled={disabled}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                onBlur={() => handleInputBlur(field.key)}
                aria-describedby={`${field.key}-description ${hasError ? `${field.key}-error` : ''}`}
                aria-invalid={hasError ? 'true' : 'false'}
              />
              
              <p id={`${field.key}-description`} className="input-description">
                {field.description}
              </p>
              
              {hasError && (
                <p id={`${field.key}-error`} className="input-error" role="alert">
                  {validationErrors[field.key]}
                </p>
              )}
            </div>
          );
        })}
      </form>

      <div className="form-footer">
        <p className="form-note">
          All calculations are estimates based on current AWS Bedrock AgentCore pricing. 
          Actual costs may vary based on your specific usage patterns and AWS region.
        </p>
      </div>
    </div>
  );
};

export default UsageInputForm;