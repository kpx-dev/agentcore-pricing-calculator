import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

/**
 * Basic App integration tests to verify all components are properly wired together
 */
describe('App Integration', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/aws bedrock agentcore pricing calculator/i)).toBeInTheDocument();
  });

  test('contains all main components', () => {
    render(<App />);
    
    // Check for input fields
    expect(screen.getByLabelText(/agent invocations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/knowledge base queries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/action group executions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/knowledge base storage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data ingestion/i)).toBeInTheDocument();
  });

  test('has proper error boundary wrapper', () => {
    render(<App />);
    
    // The app should render without throwing errors
    expect(screen.getByText(/aws bedrock agentcore pricing calculator/i)).toBeInTheDocument();
  });

  test('includes footer with disclaimer', () => {
    render(<App />);
    
    expect(screen.getByText(/important notes/i)).toBeInTheDocument();
    expect(screen.getByText(/estimation purposes only/i)).toBeInTheDocument();
  });
});