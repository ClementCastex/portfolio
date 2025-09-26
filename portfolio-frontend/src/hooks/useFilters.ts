import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterConfig<T extends Record<string, unknown>> {
  initialValues: T;
  urlKeys?: (keyof T)[];
  debounceTime?: number;
}

export const useFilters = <T extends Record<string, unknown>>({
  initialValues,
  urlKeys = [],
  debounceTime = 300,
}: FilterConfig<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<T>(() => {
    const urlFilters = {} as T;
    urlKeys.forEach(key => {
      const value = searchParams.get(String(key));
      if (value !== null) {
        // Type assertion since we know the structure of T
        urlFilters[key] = value as T[typeof key];
      }
    });
    return { ...initialValues, ...urlFilters };
  });

  const [debouncedFilters, setDebouncedFilters] = useState<T>(filters);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilters(filters);
      
      // Update URL params
      const newSearchParams = new URLSearchParams(searchParams);
      urlKeys.forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null) {
          newSearchParams.set(String(key), String(value));
        } else {
          newSearchParams.delete(String(key));
        }
      });
      setSearchParams(newSearchParams);
    }, debounceTime);

    return () => clearTimeout(timeoutId);
  }, [filters, debounceTime, searchParams, setSearchParams, urlKeys]);

  const updateFilter = useCallback(<K extends keyof T>(
    key: K,
    value: T[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialValues);
    // Clear URL params
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
  }, [initialValues, setSearchParams]);

  const setMultipleFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  return {
    filters: debouncedFilters,
    rawFilters: filters,
    updateFilter,
    resetFilters,
    setMultipleFilters,
  };
};

export type FiltersHook<T extends Record<string, unknown>> = ReturnType<typeof useFilters<T>>; 