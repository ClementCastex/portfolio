import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface CustomPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        my: 3,
        '& .MuiPagination-ul': {
          gap: 1,
        },
        '& .MuiPaginationItem-root': {
          color: isDarkMode ? '#fff' : 'inherit',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
          '&:hover': {
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
        },
      }}
    >
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        disabled={disabled}
        variant="outlined"
        shape="rounded"
        size="large"
      />
    </Box>
  );
};

export default CustomPagination; 