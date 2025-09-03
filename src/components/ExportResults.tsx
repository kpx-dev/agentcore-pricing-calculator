import React, { useState } from 'react';
import { UsageParameters, CostBreakdown } from '../types';
import './ExportResults.css';

interface ExportResultsProps {
  usageParameters: UsageParameters;
  costBreakdown: CostBreakdown;
}

interface ExportData {
  timestamp: string;
  usageParameters: UsageParameters;
  costBreakdown: CostBreakdown;
  summary: string;
}

const ExportResults: React.FC<ExportResultsProps> = ({ usageParameters, costBreakdown }) => {
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const formatExportData = (): ExportData => {
    const timestamp = new Date().toISOString();
    const summary = `AWS Bedrock AgentCore Cost Estimate - $${costBreakdown.totalMonthlyCost.toFixed(2)}/month`;
    
    return {
      timestamp,
      usageParameters,
      costBreakdown,
      summary
    };
  };

  const generateFormattedText = (data: ExportData): string => {
    return `${data.summary}
Generated: ${new Date(data.timestamp).toLocaleString()}

USAGE PARAMETERS:
• Agent Invocations: ${data.usageParameters.agentInvocations.toLocaleString()}/month
• Knowledge Base Queries: ${data.usageParameters.knowledgeBaseQueries.toLocaleString()}/month
• Action Group Executions: ${data.usageParameters.actionGroupExecutions.toLocaleString()}/month
• Storage: ${data.usageParameters.storageGB.toLocaleString()} GB
• Data Ingestion: ${data.usageParameters.dataIngestionGB.toLocaleString()} GB

COST BREAKDOWN:
• Agent Invocations: $${data.costBreakdown.agentInvocationsCost.toFixed(2)}
• Knowledge Base Queries: $${data.costBreakdown.knowledgeBaseQueriesCost.toFixed(2)}
• Action Group Executions: $${data.costBreakdown.actionGroupExecutionsCost.toFixed(2)}
• Storage: $${data.costBreakdown.storageCost.toFixed(2)}
• Data Ingestion: $${data.costBreakdown.dataIngestionCost.toFixed(2)}

TOTAL MONTHLY ESTIMATE: $${data.costBreakdown.totalMonthlyCost.toFixed(2)}

Note: This is an estimate based on AWS Bedrock AgentCore pricing. Actual costs may vary.`;
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Check if clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Clipboard API failed:', error);
        return false;
      }
    }
    
    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  };

  const fallbackCopyToClipboard = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  };

  const handleExport = async () => {
    try {
      const exportData = formatExportData();
      const formattedText = generateFormattedText(exportData);
      
      const success = await copyToClipboard(formattedText);
      
      if (success) {
        setExportStatus('success');
        setStatusMessage('Calculation results copied to clipboard!');
      } else {
        setExportStatus('error');
        setStatusMessage('Failed to copy to clipboard. Please try again or copy manually.');
      }
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
        setStatusMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setStatusMessage('Export failed. Please try again.');
      
      setTimeout(() => {
        setExportStatus('idle');
        setStatusMessage('');
      }, 3000);
    }
  };

  const isExportDisabled = costBreakdown.totalMonthlyCost === 0;

  return (
    <div className="export-results">
      <div className="export-actions">
        <button
          className={`export-button ${exportStatus}`}
          onClick={handleExport}
          disabled={isExportDisabled}
          aria-label="Copy calculation results to clipboard"
        >
          {exportStatus === 'success' ? '✓ Copied!' : 
           exportStatus === 'error' ? '✗ Failed' : 
           '📋 Copy Results'}
        </button>
        
        {statusMessage && (
          <div 
            className={`status-message ${exportStatus}`}
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </div>
        )}
      </div>
      
      {isExportDisabled && (
        <p className="export-hint">
          Enter usage parameters to enable export functionality
        </p>
      )}
    </div>
  );
};

export default ExportResults;