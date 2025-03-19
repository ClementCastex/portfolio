import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface UseSortingConfig {
  defaultSort?: SortConfig;
  urlKey?: string;
}

export const useSorting = ({
  defaultSort = { field: '', direction: 'asc' },
  urlKey = 'sort',
}: UseSortingConfig = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize sort from URL or default
  const initializeSort = (): SortConfig => {
    const sortParam = searchParams.get(urlKey);
    if (sortParam) {
      const [field, direction] = sortParam.split(':');
      if (field && (direction === 'asc' || direction === 'desc')) {
        return { field, direction };
      }
    }
    return defaultSort;
  };

  const [sort, setSort] = useState<SortConfig>(initializeSort());

  const updateSort = useCallback((field: string) => {
    setSort(prevSort => {
      const newSort: SortConfig = {
        field,
        direction: prevSort.field === field && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc',
      };

      // Update URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(urlKey, `${newSort.field}:${newSort.direction}`);
      setSearchParams(newSearchParams);

      return newSort;
    });
  }, [searchParams, setSearchParams, urlKey]);

  const resetSort = useCallback(() => {
    setSort(defaultSort);
    // Clear sort from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(urlKey);
    setSearchParams(newSearchParams);
  }, [defaultSort, searchParams, setSearchParams, urlKey]);

  const getSortedData = useCallback(<T extends Record<string, unknown>>(
    data: T[],
    customSortFn?: (a: T, b: T, sortConfig: SortConfig) => number
  ): T[] => {
    if (!sort.field) return data;

    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (customSortFn) {
        return customSortFn(a, b, sort);
      }

      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sortedData;
  }, [sort]);

  return {
    sort,
    updateSort,
    resetSort,
    getSortedData,
  };
};

export type SortingHook = ReturnType<typeof useSorting>; 