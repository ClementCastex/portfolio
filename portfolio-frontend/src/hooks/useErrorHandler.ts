import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string | null;
  code?: number;
  details?: any;
}

interface UseErrorHandlerReturn {
  error: ErrorState;
  setError: (message: string, code?: number, details?: any) => void;
  clearError: () => void;
  handleApiError: (err: any) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: null,
    code: undefined,
    details: undefined,
  });

  const setError = useCallback((message: string, code?: number, details?: any) => {
    setErrorState({
      hasError: true,
      message,
      code,
      details,
    });
    
    // Log l'erreur pour le débogage en développement
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error [${code || 'Unknown'}]: ${message}`, details);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: null,
      code: undefined,
      details: undefined,
    });
  }, []);

  // Fonction utilitaire pour gérer les erreurs d'API
  const handleApiError = useCallback((err: any) => {
    const message = 
      err.response?.data?.message || 
      err.message || 
      'Une erreur est survenue. Veuillez réessayer plus tard.';
    
    const code = err.response?.status || err.code || 500;
    
    setError(message, code, err);
  }, [setError]);

  return {
    error,
    setError,
    clearError,
    handleApiError,
  };
}; 