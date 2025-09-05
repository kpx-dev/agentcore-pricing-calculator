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
   * Callback function called when form is submitted
   */
  onSubmit: (parameters: UsageParameters) => void;
  
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
  // Runtime consumption
  {
    key: 'runtimeCpuHours',
    label: 'Runtime CPU Hours',
    placeholder: '100',
    description: 'vCPU hours consumed by runtime per month',
    unit: 'vCPU-hours/month',
    constraintKey: 'runtimeCpuHours',
  },
  {
    key: 'runtimeMemoryGBHours',
    label: 'Runtime Memory',
    placeholder: '500',
    description: 'GB-hours of memory consumed by runtime per month',
    unit: 'GB-hours/month',
    constraintKey: 'runtimeMemoryGBHours',
  },
  
  // Browser Tool consumption
  {
    key: 'browserToolCpuHours',
    label: 'Browser Tool CPU Hours',
    placeholder: '50',
    description: 'vCPU hours consumed by browser tool per month',
    unit: 'vCPU-hours/month',
    constraintKey: 'browserToolCpuHours',
  },
  {
    key: 'browserToolMemoryGBHours',
    label: 'Browser Tool Memory',
    placeholder: '250',
    description: 'GB-hours of memory consumed by browser tool per month',
    unit: 'GB-hours/month',
    constraintKey: 'browserToolMemoryGBHours',
  },
  
  // Code Interpreter consumption
  {
    key: 'codeInterpreterCpuHours',
    label: 'Code Interpreter CPU Hours',
    placeholder: '30',
    description: 'vCPU hours consumed by code interpreter per month',
    unit: 'vCPU-hours/month',
    constraintKey: 'codeInterpreterCpuHours',
  },
  {
    key: 'codeInterpreterMemoryGBHours',
    label: 'Code Interpreter Memory',
    placeholder: '150',
    description: 'GB-hours of memory consumed by code interpreter per month',
    unit: 'GB-hours/month',
    constraintKey: 'codeInterpreterMemoryGBHours',
  },
  
  // Gateway API invocations
  {
    key: 'gatewayApiInvocations',
    label: 'Gateway API Invocations',
    placeholder: '10000',
    description: 'Number of ListTools and InvokeTool API calls per month',
    unit: 'invocations/month',
    constraintKey: 'gatewayApiInvocations',
  },
  {
    key: 'gatewaySearchApiInvocations',
    label: 'Gateway Search API Invocations',
    placeholder: '5000',
    description: 'Number of Search API calls per month',
    unit: 'invocations/month',
    constraintKey: 'gatewaySearchApiInvocations',
  },
  {
    key: 'gatewayToolIndexing',
    label: 'Gateway Tool Indexing',
    placeholder: '100',
    description: 'Number of tools indexed per month',
    unit: 'tools/month',
    constraintKey: 'gatewayToolIndexing',
  },
  
  // Identity token requests
  {
    key: 'identityTokenRequests',
    label: 'Identity Token Requests',
    placeholder: '2000',
    description: 'Token/API key requests for non-AWS resources per month',
    unit: 'requests/month',
    constraintKey: 'identityTokenRequests',
  },
  
  // Memory service parameters
  {
    key: 'memoryShortTermEvents',
    label: 'Memory Short-Term Events',
    placeholder: '5000',
    description: 'Number of new short-term memory events per month',
    unit: 'events/month',
    constraintKey: 'memoryShortTermEvents',
  },
  {
    key: 'memoryLongTermStorageBuiltIn',
    label: 'Memory Long-Term Storage (Built-in)',
    placeholder: '1000',
    description: 'Number of memories stored using built-in strategies per month',
    unit: 'memories/month',
    constraintKey: 'memoryLongTermStorageBuiltIn',
  },
  {
    key: 'memoryLongTermStorageCustom',
    label: 'Memory Long-Term Storage (Custom)',
    placeholder: '500',
    description: 'Number of memories stored using custom strategies per month',
    unit: 'memories/month',
    constraintKey: 'memoryLongTermStorageCustom',
  },
  {
    key: 'memoryLongTermRetrievals',
    label: 'Memory Long-Term Retrievals',
    placeholder: '2000',
    description: 'Number of long-term memory retrievals per month',
    unit: 'retrievals/month',
    constraintKey: 'memoryLongTermRetrievals',
  },
];



/**
 * UsageInputForm Component
 * 
 * Provides input fields for all Bedrock AgentCore usage parameters with:
 * - Real-time validation and error display
 * - Submit button to trigger calculations
 * - Controlled inputs with proper state management
 * - Accessible form design with proper labels and descriptions
 */
export const UsageInputForm: React.FC<UsageInputFormProps> = ({
  usageParameters,
  onSubmit,
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

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const newParameters: UsageParameters = {
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

    let hasErrors = false;
    const newValidationErrors: Record<string, string> = {};

    // Validate and convert all input values
    INPUT_FIELDS.forEach(field => {
      const inputValue = inputValues[field.key] || '';
      const validation = validateInputRealTime(inputValue, field.constraintKey, false);
      
      if (validation.isValid && validation.sanitizedValue !== null) {
        newParameters[field.key] = validation.sanitizedValue;
      } else if (validation.errorMessage) {
        newValidationErrors[field.key] = validation.errorMessage;
        hasErrors = true;
      }
    });

    // Update validation errors
    setValidationErrors(newValidationErrors);

    // Only submit if no errors
    if (!hasErrors) {
      onSubmit(newParameters);
    }
  }, [inputValues, onSubmit]);

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
          Enter your expected monthly usage to calculate estimated costs for AWS Bedrock AgentCore and Memory services.
        </p>
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        {/* Runtime Section */}
        <div className="form-section">
          <h3 className="section-title">Runtime</h3>
          <p className="section-description">Consumption-based pricing for runtime execution</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('runtime')).map((field) => {
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
        </div>

        {/* Browser Tool Section */}
        <div className="form-section">
          <h3 className="section-title">Browser Tool</h3>
          <p className="section-description">Consumption-based pricing for browser tool operations</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('browserTool')).map((field) => {
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
        </div>

        {/* Code Interpreter Section */}
        <div className="form-section">
          <h3 className="section-title">Code Interpreter</h3>
          <p className="section-description">Consumption-based pricing for code interpreter operations</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('codeInterpreter')).map((field) => {
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
        </div>

        {/* Gateway Section */}
        <div className="form-section">
          <h3 className="section-title">Gateway</h3>
          <p className="section-description">Consumption-based pricing for gateway API operations</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('gateway')).map((field) => {
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
        </div>

        {/* Identity Section */}
        <div className="form-section">
          <h3 className="section-title">Identity</h3>
          <p className="section-description">Consumption-based pricing for identity operations</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('identity')).map((field) => {
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
        </div>

        {/* Memory Section */}
        <div className="form-section">
          <h3 className="section-title">Memory</h3>
          <p className="section-description">Consumption-based pricing for memory operations</p>
          {INPUT_FIELDS.filter(field => field.key.startsWith('memory')).map((field) => {
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
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={disabled}
          >
            {disabled ? 'Calculating...' : 'Calculate Costs'}
          </button>
        </div>
      </form>

      <div className="form-footer">
        <p className="form-note">
          All calculations are estimates based on current AWS Bedrock AgentCore and Memory pricing. 
          Actual costs may vary based on your specific usage patterns and AWS region.
        </p>
      </div>
    </div>
  );
};

export default UsageInputForm;