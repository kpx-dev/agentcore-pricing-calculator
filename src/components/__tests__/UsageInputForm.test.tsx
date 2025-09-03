import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UsageInputForm } from '../UsageInputForm';
import { UsageParameters } from '../../types';

// Mock usage parameters
const mockUsageParameters: UsageParameters = {
  agentInvocations: 10000,
  knowledgeBaseQueries: 5000,
  actionGroupExecutions: 2000,
  storageGB: 10.5,
  dataIngestionGB: 5.2,
};

// Mock onChange handler
const mockOnUsageChange = jest.fn();

describe('UsageInputForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields with correct labels', () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    // Check that all expected input fields are rendered
    expect(screen.getByLabelText(/agent invocations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/knowledge base queries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/action group executions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/knowledge base storage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data ingestion/i)).toBeInTheDocument();
  });

  it('displays initial values correctly', () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5.2')).toBeInTheDocument();
  });

  it('calls onUsageChange when input values change (debounced)', async () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    const agentInvocationsInput = screen.getByLabelText(/agent invocations/i);
    
    // Change the input value
    fireEvent.change(agentInvocationsInput, { target: { value: '15000' } });

    // Wait for debounced update (300ms + a bit extra)
    await waitFor(
      () => {
        expect(mockOnUsageChange).toHaveBeenCalledWith(
          expect.objectContaining({
            agentInvocations: 15000,
          })
        );
      },
      { timeout: 500 }
    );
  });

  it('shows validation errors for invalid inputs', async () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    const agentInvocationsInput = screen.getByLabelText(/agent invocations/i);
    
    // Enter invalid value (negative number)
    fireEvent.change(agentInvocationsInput, { target: { value: '-100' } });
    fireEvent.blur(agentInvocationsInput);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/value must be zero or greater/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for non-numeric inputs', async () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    const storageInput = screen.getByLabelText(/knowledge base storage/i);
    
    // Enter invalid value (text)
    fireEvent.change(storageInput, { target: { value: 'abc' } });
    fireEvent.blur(storageInput);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
    });
  });

  it('disables inputs when disabled prop is true', () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
        disabled={true}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('handles decimal inputs correctly for storage fields', async () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    const storageInput = screen.getByLabelText(/knowledge base storage/i);
    
    // Enter decimal value
    fireEvent.change(storageInput, { target: { value: '25.75' } });

    // Wait for debounced update
    await waitFor(
      () => {
        expect(mockOnUsageChange).toHaveBeenCalledWith(
          expect.objectContaining({
            storageGB: 25.75,
          })
        );
      },
      { timeout: 500 }
    );
  });

  it('sanitizes input values correctly', async () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    const agentInvocationsInput = screen.getByLabelText(/agent invocations/i);
    
    // Enter value with extra characters
    fireEvent.change(agentInvocationsInput, { target: { value: '1,000' } });

    // The input should be sanitized and the onChange should be called with clean number
    await waitFor(
      () => {
        expect(mockOnUsageChange).toHaveBeenCalledWith(
          expect.objectContaining({
            agentInvocations: 1000,
          })
        );
      },
      { timeout: 500 }
    );
  });

  it('renders form header and description', () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    expect(screen.getByText('Usage Parameters')).toBeInTheDocument();
    expect(screen.getByText(/enter your expected monthly usage/i)).toBeInTheDocument();
  });

  it('renders form footer with pricing note', () => {
    render(
      <UsageInputForm
        usageParameters={mockUsageParameters}
        onUsageChange={mockOnUsageChange}
      />
    );

    expect(screen.getByText(/all calculations are estimates/i)).toBeInTheDocument();
  });
});