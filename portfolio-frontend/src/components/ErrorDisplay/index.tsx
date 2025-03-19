import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography, Collapse } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface ErrorDisplayProps {
  message: string;
  code?: number;
  retry?: () => void;
  dismiss?: () => void;
  variant?: 'inline' | 'page' | 'toast';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  code,
  retry,
  dismiss,
  variant = 'inline',
}) => {
  if (variant === 'page') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          width: '100%',
          textAlign: 'center',
          p: 3,
        }}
      >
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Une erreur est survenue
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
          {message}
          {code && <Box component="span" sx={{ ml: 1, color: 'text.secondary' }}>
            (Code: {code})
          </Box>}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {retry && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={retry}
            >
              Réessayer
            </Button>
          )}
          {dismiss && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={dismiss}
            >
              Fermer
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  if (variant === 'toast') {
    return (
      <Collapse in={Boolean(message)}>
        <Alert 
          severity="error" 
          onClose={dismiss}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            maxWidth: '400px',
            zIndex: 9999,
            boxShadow: 3,
          }}
        >
          <AlertTitle>Erreur</AlertTitle>
          {message}
        </Alert>
      </Collapse>
    );
  }

  // Default: inline
  return (
    <Alert 
      severity="error" 
      onClose={dismiss}
      action={retry && (
        <Button 
          color="inherit" 
          size="small" 
          onClick={retry}
          startIcon={<Refresh />}
        >
          Réessayer
        </Button>
      )}
      sx={{ mb: 2 }}
    >
      <AlertTitle>Erreur{code && ` (${code})`}</AlertTitle>
      {message}
    </Alert>
  );
};

export default ErrorDisplay; 