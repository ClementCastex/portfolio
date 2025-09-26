import React from 'react';
import {
  Snackbar,
  Alert,
  AlertColor,
  Slide,
  SlideProps,
} from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  type?: AlertColor;
  autoHideDuration?: number;
  onClose: () => void;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  type = 'info',
  autoHideDuration = 6000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          minWidth: '300px',
          '& .MuiAlert-message': {
            fontSize: '1rem',
          },
          animation: 'fadeIn 0.3s ease-in',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar; 