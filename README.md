# AWS Bedrock AgentCore Pricing Calculator

A comprehensive React-based pricing calculator for AWS Bedrock AgentCore services that helps developers estimate monthly costs based on their expected usage patterns.

## Features

- **Real-time Cost Calculations**: Automatic cost updates as you modify usage parameters
- **Detailed Cost Breakdown**: View costs by service component with pricing rates
- **Input Validation**: Real-time validation with clear error messages
- **Export Functionality**: Copy calculation results to clipboard for sharing
- **Responsive Design**: Mobile-first design that works on all device sizes
- **Accessibility Compliant**: Full keyboard navigation and screen reader support
- **Error Boundaries**: Graceful error handling with fallback UI states

## Usage Parameters

The calculator supports the following AWS Bedrock AgentCore usage parameters:

- **Agent Invocations**: Number of agent invocations per month
- **Knowledge Base Queries**: Number of knowledge base queries per month  
- **Action Group Executions**: Number of action group executions per month
- **Knowledge Base Storage**: Amount of data stored in knowledge bases (GB)
- **Data Ingestion**: Amount of data ingested into knowledge bases (GB)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: CSS Modules with responsive design
- **Testing**: Jest and React Testing Library (105 tests)
- **Build Tool**: Create React App
- **Code Quality**: ESLint and TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bedrock-agentcore-pricing-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the calculator in your browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── components/           # React components
│   ├── UsageInputForm/   # Input form component
│   ├── CostBreakdown/    # Cost display component
│   ├── ExportResults/    # Export functionality component
│   ├── PricingCalculator/# Main container component
│   ├── ErrorBoundary/    # Error boundary component
│   └── __tests__/        # Component tests
├── config/               # Configuration files
│   └── pricing-config.ts # AWS pricing rates
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
│   ├── calculation-engine.ts # Core calculation logic
│   ├── pricing-utils.ts  # Pricing utilities
│   ├── validation.ts     # Input validation
│   └── __tests__/        # Utility tests
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## Pricing Data

The calculator uses current AWS Bedrock AgentCore pricing rates stored in `src/config/pricing-config.ts`. The pricing data includes:

- Source URL references to official AWS pricing
- Last updated timestamps
- Regional pricing information (US East N. Virginia)

## Testing

The application includes comprehensive test coverage:

- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: End-to-end application functionality tests
- **Accessibility Tests**: Screen reader and keyboard navigation tests
- **Error Handling Tests**: Error boundary and validation tests

## Accessibility

The calculator is fully accessible and includes:

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This calculator provides cost estimates for planning purposes only. Actual AWS costs may vary based on:

- Your specific AWS region
- Usage patterns and timing
- Available discounts and pricing tiers
- Changes to AWS pricing

For the most up-to-date pricing information, please refer to the [official AWS Bedrock AgentCore pricing page](https://aws.amazon.com/bedrock/pricing/).

## Support

For questions or issues, please open an issue in the GitHub repository.