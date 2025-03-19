import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';

interface UseInfiniteScrollProps<T> {
  items: T[];
  itemsPerPage: number;
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  visibleItems: T[];
  hasMore: boolean;
  loading: boolean;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const useInfiniteScroll = <T>({
  items,
  itemsPerPage,
  threshold = 100,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const start = 0;
      const end = page * itemsPerPage;
      setVisibleItems(items.slice(start, end));
      setLoading(false);
    }, 500); // Simule un chargement
  }, [items, page, itemsPerPage]);

  useEffect(() => {
    loadMore();
  }, [loadMore, page]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (
        !loading &&
        scrollHeight - scrollTop - clientHeight < threshold &&
        visibleItems.length < items.length
      ) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, items.length, visibleItems.length, threshold]);

  const hasMore = visibleItems.length < items.length;

  return {
    visibleItems,
    hasMore,
    loading,
    containerRef,
  };
}; 