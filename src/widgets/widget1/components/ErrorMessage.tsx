import React, { memo } from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export const ErrorMessage = memo<ErrorMessageProps>(({ error, onRetry }) => (
  <div className="error-message">
    {error}
    {' '}
    <Button onClick={onRetry}>Retry</Button>
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';