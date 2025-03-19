import { Theme } from '@mui/material/styles';

export const lightInputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#5B348B',
    },
    '&:hover fieldset': {
      borderColor: '#5B348B',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5B348B',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#23272A',
    '&.Mui-focused': {
      color: '#23272A',
    },
  },
  '& .MuiInputBase-input': {
    color: '#23272A',
  },
  '& .MuiSelect-icon': {
    color: '#23272A',
  },
};

export const darkInputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#5B348B',
    },
    '&:hover fieldset': {
      borderColor: '#5B348B',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5B348B',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#F7F3F7',
    '&.Mui-focused': {
      color: '#F7F3F7',
    },
  },
  '& .MuiInputBase-input': {
    color: '#F7F3F7',
  },
  '& .MuiSelect-icon': {
    color: '#F7F3F7',
  },
};

export const commonButtonStyle = {
  color: 'white',
  '&:hover': {
    color: 'white',
  },
};

export const cardStyle = {
  p: 6,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: (theme: Theme) => `${theme.palette.primary.main}15`,
  borderRadius: 4,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  border: '1px solid #5B348B',
  '&:hover': {
    transform: 'translateY(-10px)',
    backgroundColor: (theme: Theme) => `${theme.palette.primary.main}25`,
    border: '1px solid #5B348B',
  },
}; 