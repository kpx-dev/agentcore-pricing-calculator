import React, { useState } from 'react';
import './App.css';
import { UsageInputForm } from './components';
import { UsageParameters } from './types';

const App: React.FC = () => {
  const [usageParameters, setUsageParameters] = useState<UsageParameters>({
    agentInvocations: 0,
    knowledgeBaseQueries: 0,
    actionGroupExecutions: 0,
    storageGB: 0,
    dataIngestionGB: 0,
  });

  const handleUsageChange = (parameters: UsageParameters) => {
    setUsageParameters(parameters);
    console.log('Usage parameters updated:', parameters);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bedrock AgentCore Pricing Calculator</h1>
        <p>Calculate your estimated monthly costs for AWS Bedrock AgentCore services</p>
      </header>
      
      <main className="App-main">
        <UsageInputForm
          usageParameters={usageParameters}
          onUsageChange={handleUsageChange}
        />
        
        {/* Temporary display of current parameters for testing */}
        <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Current Parameters (Debug)</h3>
          <pre>{JSON.stringify(usageParameters, null, 2)}</pre>
        </div>
      </main>
    </div>
  );
};

export default App;