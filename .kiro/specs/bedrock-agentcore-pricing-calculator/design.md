# Design Document

## Overview

The Bedrock AgentCore Pricing Calculator will be a single-page web application that provides real-time cost estimation for AWS Bedrock AgentCore services. The calculator will feature a clean, intuitive interface with input fields for various usage parameters and dynamic cost calculations with detailed breakdowns.

## Architecture

The application will use a client-side architecture with the following key components:

- **Frontend Framework**: React with TypeScript for type safety and component-based architecture
- **Styling**: CSS modules or styled-components for component-scoped styling
- **State Management**: React hooks (useState, useEffect) for local state management
- **Calculation Engine**: Pure JavaScript functions for pricing calculations
- **Data Layer**: Static pricing configuration based on AWS Bedrock AgentCore rates

## Components and Interfaces

### Core Components

#### 1. PricingCalculator (Main Container)
- Manages overall application state
- Coordinates between input and output components
- Handles calculation triggers

#### 2. UsageInputForm
- Renders input fields for usage parameters:
  - Agent invocations per month
  - Knowledge base queries per month
  - Action group executions per month
  - Knowledge base storage (GB)
  - Data ingestion volume (GB)
- Validates user inputs
- Triggers real-time calculations on input changes

#### 3. CostBreakdown
- Displays calculated costs by component
- Shows individual pricing rates
- Presents total monthly estimate
- Formats currency values consistently

#### 4. ExportResults
- Provides copy-to-clipboard functionality
- Generates shareable calculation summaries
- Formats export data in readable format

### Data Models

#### UsageParameters Interface
```typescript
interface UsageParameters {
  agentInvocations: number;
  knowledgeBaseQueries: number;
  actionGroupExecutions: number;
  storageGB: number;
  dataIngestionGB: number;
}
```

#### CostBreakdown Interface
```typescript
interface CostBreakdown {
  agentInvocationsCost: number;
  knowledgeBaseQueriesCost: number;
  actionGroupExecutionsCost: number;
  storageCost: number;
  dataIngestionCost: number;
  totalMonthlyCost: number;
}
```

#### PricingRates Configuration
```typescript
interface PricingRates {
  agentInvocationRate: number; // per 1000 invocations
  knowledgeBaseQueryRate: number; // per 1000 queries
  actionGroupExecutionRate: number; // per 1000 executions
  storageRatePerGB: number; // per GB per month
  dataIngestionRatePerGB: number; // per GB
  lastUpdated: string; // ISO date string
  sourceUrl: string; // AWS pricing page URL
}
```

#### PricingConfig Structure
The pricing configuration will be externalized to allow easy updates:
```typescript
// pricing-config.ts
export const BEDROCK_AGENTCORE_PRICING: PricingRates = {
  // Rates can be updated here without touching application code
  agentInvocationRate: 0.00X,
  knowledgeBaseQueryRate: 0.00X,
  // ... other rates
  lastUpdated: "2025-01-XX",
  sourceUrl: "https://aws.amazon.com/bedrock/agentcore/pricing/"
};
```

## Error Handling

### Input Validation
- Validate that all numeric inputs are non-negative
- Display inline error messages for invalid inputs
- Prevent calculation with invalid data
- Provide clear guidance on expected input formats

### Calculation Errors
- Handle edge cases like extremely large numbers
- Provide fallback values for missing pricing data
- Log calculation errors for debugging
- Display user-friendly error messages

### Export Functionality
- Handle clipboard API failures gracefully
- Provide alternative export methods if clipboard is unavailable
- Validate export data before generation



## Implementation Notes

### Pricing Data Source
- Pricing rates will be stored in a separate configuration file (pricing-config.ts) for easy maintenance
- Configuration will include metadata like source URLs, last updated dates, and effective dates
- Simple JSON-like structure that can be easily updated without touching application logic
- Clear separation between pricing data and calculation logic to enable quick pricing updates

### Performance Considerations
- Debounce input changes to avoid excessive calculations
- Memoize expensive calculations where appropriate
- Optimize re-renders with React.memo for stable components

### Accessibility
- Ensure proper ARIA labels for form inputs
- Provide keyboard navigation support
- Use semantic HTML elements
- Include screen reader friendly descriptions for calculations

### Responsive Design
- Mobile-first approach for input forms
- Collapsible sections for detailed breakdowns on small screens
- Touch-friendly interface elements
- Readable typography across device sizes