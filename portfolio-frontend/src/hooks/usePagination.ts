import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface PaginationConfig {
  initialPage?: number;
  initialPageSize?: number;
  urlPageKey?: string;
  urlPageSizeKey?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  urlPageKey = 'page',
  urlPageSizeKey = 'size',
}: PaginationConfig = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL or defaults
  const initializeState = () => {
    const pageParam = searchParams.get(urlPageKey);
    const sizeParam = searchParams.get(urlPageSizeKey);

    return {
      currentPage: pageParam ? Math.max(1, parseInt(pageParam, 10)) : initialPage,
      pageSize: sizeParam ? Math.max(1, parseInt(sizeParam, 10)) : initialPageSize,
    };
  };

  const [state, setState] = useState(initializeState);

  const setPage = useCallback((page: number) => {
    setState(prev => {
      const newPage = Math.max(1, page);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(urlPageKey, String(newPage));
      setSearchParams(newSearchParams);
      return { ...prev, currentPage: newPage };
    });
  }, [searchParams, setSearchParams, urlPageKey]);

  const setPageSize = useCallback((size: number) => {
    setState(prev => {
      const newSize = Math.max(1, size);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(urlPageSizeKey, String(newSize));
      setSearchParams(newSearchParams);
      return { ...prev, pageSize: newSize, currentPage: 1 };
    });
  }, [searchParams, setSearchParams, urlPageSizeKey]);

  const getPaginatedData = useCallback(<T>(data: T[]): T[] => {
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    return data.slice(startIndex, endIndex);
  }, [state.currentPage, state.pageSize]);

  const getPaginationInfo = useCallback((totalItems: number): PaginationInfo => {
    const totalPages = Math.ceil(totalItems / state.pageSize);
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = Math.min(startIndex + state.pageSize, totalItems);

    return {
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      totalItems,
      totalPages,
      hasNextPage: state.currentPage < totalPages,
      hasPreviousPage: state.currentPage > 1,
      startIndex,
      endIndex,
    };
  }, [state.currentPage, state.pageSize]);

  const reset = useCallback(() => {
    setState({
      currentPage: initialPage,
      pageSize: initialPageSize,
    });
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(urlPageKey);
    newSearchParams.delete(urlPageSizeKey);
    setSearchParams(newSearchParams);
  }, [initialPage, initialPageSize, searchParams, setSearchParams, urlPageKey, urlPageSizeKey]);

  const pageNumbers = useCallback((totalItems: number): number[] => {
    const totalPages = Math.ceil(totalItems / state.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [state.pageSize]);

  return {
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    setPage,
    setPageSize,
    getPaginatedData,
    getPaginationInfo,
    reset,
    pageNumbers,
  };
};

export type PaginationHook = ReturnType<typeof usePagination>; 