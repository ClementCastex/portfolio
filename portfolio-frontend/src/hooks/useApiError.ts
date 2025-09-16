import { useState, useCallback } from 'react';

interface UseApiErrorReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleApiError: (error: unknown) => void;
  clearError: () => void;
}

export const useApiError = (): UseApiErrorReturn => {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('Une erreur inattendue est survenue');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleApiError,
    clearError,
  };
}; 