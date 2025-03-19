import { useState, useEffect, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface FetchOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (url: string, options?: FetchOptions) => Promise<T | null>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  refetch: () => Promise<void>;
}

export const useFetchData = <T>(
  url: string, 
  initialOptions?: FetchOptions
): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(url);
  const [options, setOptions] = useState<FetchOptions | undefined>(initialOptions);
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { handleApiError } = useErrorHandler();

  const fetchData = useCallback(async (
    fetchUrl: string = currentUrl, 
    fetchOptions: FetchOptions = options || {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { headers = {}, requiresAuth = false, method = 'GET', body } = fetchOptions;
      
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };
      
      // Ajouter le token d'authentification si nécessaire
      if (requiresAuth && token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
      
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };
      
      // Ajouter le body pour les requêtes POST, PUT, PATCH
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(body);
      }
      
      const response = await fetch(fetchUrl, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Erreur ${response.status}: ${response.statusText}`
        );
      }
      
      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err: any) {
      handleApiError(err);
      setError(err.message || 'Une erreur est survenue lors de la récupération des données');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUrl, options, token, handleApiError]);
  
  // Effectuer la requête initiale
  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
      fetchData(url, initialOptions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  
  // Fonction pour relancer la requête
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    fetchData,
    setData,
    refetch,
  };
}; 