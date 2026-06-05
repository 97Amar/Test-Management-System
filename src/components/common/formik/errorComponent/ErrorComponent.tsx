import React from 'react';
import type { ReactNode } from 'react';

interface ErrorComponentProps {
  error?: any;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
  if (!error || typeof error === 'boolean') return null;
  return <div className="error-message text-danger" style={{ color: 'red', fontSize: '0.875rem' }}>{error as ReactNode}</div>;
};

export default ErrorComponent;
