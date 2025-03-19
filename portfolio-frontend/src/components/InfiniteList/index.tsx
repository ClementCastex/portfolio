import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface InfiniteListProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: string | number;
  loadingComponent?: React.ReactNode;
}

const InfiniteList = <T extends any>({
  items,
  itemsPerPage,
  renderItem,
  height = '600px',
  loadingComponent,
}: InfiniteListProps<T>) => {
  const { visibleItems, hasMore, loading, containerRef } = useInfiniteScroll({
    items,
    itemsPerPage,
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        height,
        overflowY: 'auto',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme => theme.palette.primary.main,
          borderRadius: '4px',
          '&:hover': {
            background: theme => theme.palette.primary.dark,
          },
        },
      }}
    >
      {visibleItems.map((item, index) => renderItem(item, index))}
      
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 2,
          }}
        >
          {loadingComponent || (
            <CircularProgress
              size={30}
              sx={{
                color: 'primary.main',
              }}
            />
          )}
        </Box>
      )}
      
      {!hasMore && items.length > 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
            color: 'text.secondary',
          }}
        >
          Fin de la liste
        </Box>
      )}
    </Box>
  );
};

export default InfiniteList; 