import React, { useState, useEffect } from 'react';
import { Zoom, IconButton, useTheme } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Vérifier si l'utilisateur a scrollé vers le bas
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <Zoom in={isVisible}>
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          color: 'white',
          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#5B348B',
          '&:hover': {
            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#4a2a70',
          },
          zIndex: 1000,
          boxShadow: 3,
          width: 45,
          height: 45,
        }}
        aria-label="scroll to top"
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Zoom>
  );
};

export default ScrollToTop; 