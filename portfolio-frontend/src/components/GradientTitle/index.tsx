import React from 'react';
import { Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface GradientTitleProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const GradientTitle: React.FC<GradientTitleProps> = ({ children, variant = 'h2' }) => {
  return (
    <Typography 
      variant={variant}
      sx={{ 
        position: 'relative',
        mb: 3, 
        fontWeight: 'bold',
        fontSize: { xs: '2.5rem', md: '3.5rem' },
        background: theme => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #CCAA1D 0%, #E6C545 50%, #CCAA1D 100%)'
          : 'linear-gradient(135deg, #5B348B 0%, #7A73A8 50%, #5B348B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: theme => theme.palette.mode === 'dark'
          ? 'drop-shadow(0 0 8px rgba(204, 170, 29, 0.5))'
          : 'drop-shadow(0 0 8px rgba(91, 52, 139, 0.5))',
        animation: `${gradient} 3s ease infinite`,
        backgroundSize: '200% 200%',
        letterSpacing: '0.05em'
      }}
    >
      {children}
    </Typography>
  );
};

export default GradientTitle; 