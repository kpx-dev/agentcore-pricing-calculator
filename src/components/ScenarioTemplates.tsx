import React, { useState } from 'react';
import { ScenarioTemplate, SCENARIO_TEMPLATES, UsageParameters } from '../types';
import './ScenarioTemplates.css';

/**
 * Props for the ScenarioTemplates component
 */
interface ScenarioTemplatesProps {
  /**
   * Callback when a template is selected
   */
  onTemplateSelect: (usageParameters: UsageParameters) => void;
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * Category filter options
 */
const CATEGORY_FILTERS = [
  { value: 'all', label: 'All Scenarios' },
  { value: 'runtime', label: 'Runtime' },
  { value: 'browser', label: 'Browser Tool' },
  { value: 'code-interpreter', label: 'Code Interpreter' },
  { value: 'gateway', label: 'Gateway' },
  { value: 'memory', label: 'Memory' },
  { value: 'multi-service', label: 'Multi-Service' },
];

/**
 * ScenarioTemplates Component
 * 
 * Displays pre-configured scenario templates that users can select
 * to quickly populate the calculator with realistic usage patterns.
 */
export const ScenarioTemplates: React.FC<ScenarioTemplatesProps> = ({
  onTemplateSelect,
  disabled = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Filter templates based on selected category
  const filteredTemplates = selectedCategory === 'all' 
    ? SCENARIO_TEMPLATES 
    : SCENARIO_TEMPLATES.filter(template => template.category === selectedCategory);

  /**
   * Handle template selection
   */
  const handleTemplateSelect = (template: ScenarioTemplate) => {
    if (disabled) return;
    // Set the selected template (this will clear any previously selected template)
    setSelectedTemplate(template.id);
    onTemplateSelect(template.usageParameters);
  };

  /**
   * Toggle template details expansion
   */
  const toggleTemplateDetails = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId);
  };

  /**
   * Get category badge color
   */
  const getCategoryBadgeClass = (category: string) => {
    const baseClass = 'category-badge';
    switch (category) {
      case 'runtime': return `${baseClass} category-runtime`;
      case 'browser': return `${baseClass} category-browser`;
      case 'code-interpreter': return `${baseClass} category-code-interpreter`;
      case 'gateway': return `${baseClass} category-gateway`;
      case 'memory': return `${baseClass} category-memory`;
      case 'multi-service': return `${baseClass} category-multi-service`;
      default: return baseClass;
    }
  };

  /**
   * Format large numbers for display
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="scenario-templates">
      <div className="templates-header">
        <h3>Scenario Templates</h3>
        <p className="templates-description">
          Select a pre-configured scenario to quickly populate the calculator with realistic usage patterns.
        </p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="category-select" className="filter-label">
          Filter by Category:
        </label>
        <select
          id="category-select"
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={disabled}
        >
          {CATEGORY_FILTERS.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id} 
            className={`template-card ${selectedTemplate === template.id ? 'template-selected' : ''}`}
          >
            <div className="template-header">
              <div className="template-title-section">
                <h4 className="template-name">{template.name}</h4>
                <span className={getCategoryBadgeClass(template.category)}>
                  {template.category.replace('-', ' ')}
                </span>
              </div>
              <p className="template-description">{template.description}</p>
            </div>

            <div className="template-summary">
              <div className="summary-item">
                <span className="summary-label">Monthly Requests:</span>
                <span className="summary-value">
                  {formatNumber(template.details.monthlyRequests)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Session Duration:</span>
                <span className="summary-value">{template.details.sessionDuration}</span>
              </div>
            </div>

            <div className="template-actions">
              <button
                className={`use-template-button ${selectedTemplate === template.id ? 'button-selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
                disabled={disabled}
              >
                {selectedTemplate === template.id ? '✓ Applied!' : 'Use This Template'}
              </button>
              <button
                className="details-toggle-button"
                onClick={() => toggleTemplateDetails(template.id)}
                aria-expanded={expandedTemplate === template.id}
              >
                {expandedTemplate === template.id ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {/* Expanded Details */}
            {expandedTemplate === template.id && (
              <div className="template-details">
                <div className="details-section">
                  <h5>Use Case</h5>
                  <p>{template.details.useCase}</p>
                </div>

                <div className="details-section">
                  <h5>Technical Specifications</h5>
                  <ul className="specs-list">
                    <li><strong>CPU Utilization:</strong> {template.details.cpuUtilization}</li>
                    <li><strong>Memory Usage:</strong> {template.details.memoryUsage}</li>
                  </ul>
                </div>

                <div className="details-section">
                  <h5>Key Features</h5>
                  <ul className="features-list">
                    {template.details.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="details-section">
                  <h5>Usage Parameters Preview</h5>
                  <div className="usage-preview">
                    {Object.entries(template.usageParameters)
                      .filter(([_, value]) => value > 0)
                      .map(([key, value]) => (
                        <div key={key} className="usage-item">
                          <span className="usage-key">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                          </span>
                          <span className="usage-value">{formatNumber(value)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="no-templates">
          <p>No templates found for the selected category.</p>
        </div>
      )}

      <div className="templates-footer">
        <p className="templates-note">
          These templates are based on real-world usage patterns and AWS pricing examples. 
          You can modify the values after selecting a template to match your specific requirements.
        </p>
      </div>
    </div>
  );
};

export default ScenarioTemplates;