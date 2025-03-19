import { useState, useCallback, useRef, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
}

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export const useApi = <T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
) => {
  const {
    cacheTime = DEFAULT_CACHE_TIME,
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelay = DEFAULT_RETRY_DELAY,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleApiError } = useErrorHandler();
  const cache = useRef<CacheItem<T> | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isCacheValid = useCallback((): boolean => {
    if (!cache.current) return false;
    return Date.now() - cache.current.timestamp < cacheTime;
  }, [cacheTime]);

  const fetchWithRetry = useCallback(async (): Promise<void> => {
    try {
      abortControllerRef.current = new AbortController();
      const data = await fetcher();
      cache.current = { data, timestamp: Date.now() };
      setState({ data, loading: false, error: null });
      retryCountRef.current = 0;
    } catch (error) {
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry();
      }
      handleApiError(error);
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
    }
  }, [fetcher, retryCount, retryDelay, handleApiError]);

  const fetchData = useCallback(async (force = false): Promise<void> => {
    if (!force && isCacheValid() && cache.current) {
      setState({ data: cache.current.data, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    await fetchWithRetry();
  }, [fetchWithRetry, isCacheValid]);

  const clearCache = useCallback((): void => {
    cache.current = null;
  }, []);

  const abort = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    ...state,
    fetchData,
    clearCache,
    abort,
  };
};

export type ApiHook<T> = ReturnType<typeof useApi<T>>; 