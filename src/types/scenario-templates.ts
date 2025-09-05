import { UsageParameters } from './index';

/**
 * Scenario template interface for pre-configured usage examples
 */
export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'runtime' | 'browser' | 'code-interpreter' | 'gateway' | 'memory' | 'multi-service';
  usageParameters: UsageParameters;
  details: {
    useCase: string;
    monthlyRequests: number;
    sessionDuration: string;
    cpuUtilization: string;
    memoryUsage: string;
    keyFeatures: string[];
  };
}

/**
 * Pre-configured scenario templates based on real-world use cases
 */
export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'customer-support-agent',
    name: 'Customer Support Agent',
    description: 'AI agent handling customer queries with RAG and MCP tools',
    category: 'runtime',
    usageParameters: {
      // Runtime: 10M sessions × 18 seconds CPU × 1 vCPU = 50,000 vCPU-hours
      runtimeCpuHours: 50000,
      // Runtime: 10M sessions × 60 seconds × 2GB = 333,333 GB-hours  
      runtimeMemoryGBHours: 333333,
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
    },
    details: {
      useCase: 'Customer support agent resolving user queries across chat and email',
      monthlyRequests: 10000000,
      sessionDuration: '60 seconds',
      cpuUtilization: '1 vCPU with 70% I/O wait time (18 seconds active)',
      memoryUsage: '2GB continuously',
      keyFeatures: [
        'RAG for product policies',
        'MCP tools for order status',
        'Multi-step reasoning',
        'Session isolation',
        'Scalable to millions of sessions'
      ]
    }
  },
  {
    id: 'travel-booking-system',
    name: 'Automated Travel Booking',
    description: 'AI agent automating trip planning through web interactions',
    category: 'browser',
    usageParameters: {
      runtimeCpuHours: 0,
      runtimeMemoryGBHours: 0,
      // Browser: 100K sessions × 120 seconds × 20% active × 2 vCPU = 1,333 vCPU-hours
      browserToolCpuHours: 1333,
      // Browser: 100K sessions × 600 seconds × 4GB = 66,667 GB-hours
      browserToolMemoryGBHours: 66667,
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
    },
    details: {
      useCase: 'Travel booking AI agent automating full trip planning and booking',
      monthlyRequests: 100000,
      sessionDuration: '10 minutes',
      cpuUtilization: '2 vCPU with 80% I/O wait time (2 minutes active)',
      memoryUsage: '4GB continuously',
      keyFeatures: [
        'Headless browser automation',
        'Flight and hotel search',
        'Price extraction',
        'Booking form submission',
        'Session-isolated sandbox',
        'Live View and Session Replay'
      ]
    }
  },
  {
    id: 'data-analysis-automation',
    name: 'Data Analysis Automation',
    description: 'Natural language data analysis with Python code execution',
    category: 'code-interpreter',
    usageParameters: {
      runtimeCpuHours: 0,
      runtimeMemoryGBHours: 0,
      browserToolCpuHours: 0,
      browserToolMemoryGBHours: 0,
      // Code Interpreter: 30K executions × 48 seconds × 2 vCPU = 800 vCPU-hours
      codeInterpreterCpuHours: 800,
      // Code Interpreter: 30K executions × 120 seconds × 4GB = 4,000 GB-hours
      codeInterpreterMemoryGBHours: 4000,
      gatewayApiInvocations: 0,
      gatewaySearchApiInvocations: 0,
      gatewayToolIndexing: 0,
      identityTokenRequests: 0,
      memoryShortTermEvents: 0,
      memoryLongTermStorageBuiltIn: 0,
      memoryLongTermStorageCustom: 0,
      memoryLongTermRetrievals: 0,
    },
    details: {
      useCase: 'Data analyst agent supporting business teams with dataset queries and visualizations',
      monthlyRequests: 10000,
      sessionDuration: '2 minutes per execution (3 executions per request)',
      cpuUtilization: '2 vCPU with 60% I/O wait time (48 seconds active)',
      memoryUsage: '4GB continuously',
      keyFeatures: [
        'Natural language queries',
        'Dynamic Python code generation',
        'Statistical analysis',
        'Data visualizations',
        'Isolated sandbox environments',
        'Multi-language support'
      ]
    }
  },
  {
    id: 'hr-assistant-tools',
    name: 'HR Assistant with Internal Tools',
    description: 'HR assistant connecting to multiple internal systems via MCP',
    category: 'gateway',
    usageParameters: {
      runtimeCpuHours: 0,
      runtimeMemoryGBHours: 0,
      browserToolCpuHours: 0,
      browserToolMemoryGBHours: 0,
      codeInterpreterCpuHours: 0,
      codeInterpreterMemoryGBHours: 0,
      // Gateway: 200M InvokeTool calls
      gatewayApiInvocations: 200000000,
      // Gateway: 50M Search API calls
      gatewaySearchApiInvocations: 50000000,
      // Gateway: 200 tools indexed
      gatewayToolIndexing: 200,
      identityTokenRequests: 0,
      memoryShortTermEvents: 0,
      memoryLongTermStorageBuiltIn: 0,
      memoryLongTermStorageCustom: 0,
      memoryLongTermRetrievals: 0,
    },
    details: {
      useCase: 'HR assistant for mid-sized enterprise handling policy questions and system access',
      monthlyRequests: 50000000,
      sessionDuration: 'Variable per interaction',
      cpuUtilization: 'API-based (no compute)',
      memoryUsage: 'API-based (no memory)',
      keyFeatures: [
        '200 internal tools via MCP',
        'Policy questions',
        'Leave balance queries',
        'Benefits enrollment',
        'Payroll inquiries',
        'Dynamic tool matching'
      ]
    }
  },
  {
    id: 'secure-support-access',
    name: 'Secure Customer Support Access',
    description: 'Customer support with secure delegated access to multiple tools',
    category: 'multi-service',
    usageParameters: {
      runtimeCpuHours: 0,
      runtimeMemoryGBHours: 0,
      browserToolCpuHours: 0,
      browserToolMemoryGBHours: 0,
      codeInterpreterCpuHours: 0,
      codeInterpreterMemoryGBHours: 0,
      gatewayApiInvocations: 0,
      gatewaySearchApiInvocations: 0,
      gatewayToolIndexing: 0,
      // Identity: 150K token requests (10K users × 5 sessions × 3 tools)
      identityTokenRequests: 150000,
      memoryShortTermEvents: 0,
      memoryLongTermStorageBuiltIn: 0,
      memoryLongTermStorageCustom: 0,
      memoryLongTermRetrievals: 0,
    },
    details: {
      useCase: 'Customer support agent with secure access to Slack, Zoom, and GitHub',
      monthlyRequests: 50000,
      sessionDuration: 'Variable per session',
      cpuUtilization: 'Token-based (no compute)',
      memoryUsage: 'Token-based (no memory)',
      keyFeatures: [
        'Delegated access management',
        'OAuth token handling',
        'IAM role integration',
        'Slack conversations',
        'Zoom call logs',
        'GitHub issue tracking'
      ]
    }
  },
  {
    id: 'personalized-coding-assistant',
    name: 'Personalized Coding Assistant',
    description: 'Coding assistant with persistent memory across sessions',
    category: 'memory',
    usageParameters: {
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
      // Memory: 100K short-term events
      memoryShortTermEvents: 100000,
      // Memory: 10K long-term memories (built-in)
      memoryLongTermStorageBuiltIn: 10000,
      // Memory: 0 custom long-term memories
      memoryLongTermStorageCustom: 0,
      // Memory: 20K retrievals
      memoryLongTermRetrievals: 20000,
    },
    details: {
      useCase: 'Coding assistant helping software engineers with personalized experience',
      monthlyRequests: 100000,
      sessionDuration: 'Variable per interaction',
      cpuUtilization: 'Memory-based (no compute)',
      memoryUsage: 'Memory-based (no runtime memory)',
      keyFeatures: [
        'Short-term conversation memory',
        'Long-term user preferences',
        'Debugging session summaries',
        'Code writing assistance',
        'Cross-session personalization',
        'Built-in extraction strategies'
      ]
    }
  }
];