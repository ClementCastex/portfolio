import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '@mui/material';
import { PaletteMode } from '@mui/material';

interface UseThemeModeReturn {
  mode: PaletteMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setMode: (mode: PaletteMode) => void;
}

export const useThemeMode = (): UseThemeModeReturn => {
  // Vérifier la préférence système
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Initialiser le thème à partir du localStorage ou de la préférence système
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode === 'dark' ? 'dark' : 'light';
    }
    return prefersDarkMode ? 'dark' : 'light';
  });

  // Mettre à jour le localStorage lorsque le thème change
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Mettre à jour les classes CSS sur le document
    document.documentElement.setAttribute('data-theme', mode);
    
    // Mettre à jour la meta tag pour le thème de couleur sur les appareils mobiles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#5B348B' : '#FFFFFF');
    }
  }, [mode]);

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem('themeMode');
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Ajouter le listener pour les changements de préférence système
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle le thème
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    mode,
    isDarkMode: mode === 'dark',
    toggleTheme,
    setMode,
  };
}; 