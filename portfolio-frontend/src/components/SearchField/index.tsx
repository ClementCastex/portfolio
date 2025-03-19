import React, { useState, useCallback } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { debounce } from 'lodash';
import { lightInputStyle, darkInputStyle } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';

interface SearchFieldProps extends Omit<TextFieldProps, 'onChange'> {
  onSearch: (value: string) => void;
  debounceTime?: number;
}

const SearchField: React.FC<SearchFieldProps> = ({
  onSearch,
  debounceTime = 300,
  ...props
}) => {
  const [value, setValue] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      onSearch(searchValue);
    }, debounceTime),
    [onSearch, debounceTime]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      sx={{
        ...(isDarkMode ? darkInputStyle : lightInputStyle),
        ...props.sx,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : '#CCAA1D',
          },
          '&:hover fieldset': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : '#CCAA1D',
          },
          '&.Mui-focused fieldset': {
            borderColor: isDarkMode ? '#F7F3F7' : '#CCAA1D',
          },
          '& .MuiOutlinedInput-input': {
            color: isDarkMode ? '#F7F3F7' : '#CCAA1D',
          },
        },
        '& .MuiInputLabel-root': {
          color: isDarkMode ? '#F7F3F7' : '#CCAA1D',
          '&.Mui-focused': {
            color: isDarkMode ? '#F7F3F7' : '#CCAA1D',
          },
        },
      }}
    />
  );
};

export default SearchField; 