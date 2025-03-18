import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Exo 2", "Arial", sans-serif',
    h1: {
      fontFamily: '"Exo 2", "Arial", sans-serif',
      fontWeight: 900,
      fontStyle: 'italic',
    },
    h2: {
      fontFamily: '"Exo 2", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Exo 2", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Exo 2", "Arial", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Quicksand", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Quicksand", "Arial", sans-serif',
    },
  },
};

const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#5B348B', // Violet principal
      light: '#7A73A8',
      dark: '#3F3B6C',
    },
    secondary: {
      main: '#CCAA1D', // Jaune moutarde
      light: '#E6C545',
      dark: '#B39516',
    },
    background: {
      default: '#23272A', // Gris foncé
      paper: '#2C2F33', // Un peu plus clair pour les cartes
    },
    text: {
      primary: '#F7F3F7', // Blanc cassé pour le texte principal
      secondary: '#CCAA1D', // Jaune moutarde pour le texte secondaire
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#F7F3F7',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Exo 2", "Arial", sans-serif',
          textTransform: 'none',
          color: '#F7F3F7',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#F7F3F7',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          subtitle1: 'h5',
          subtitle2: 'h6',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F7F3F7',
          '&:hover': {
            color: '#CCAA1D',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#F7F3F7',
          '&:hover': {
            color: '#CCAA1D',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
});

const lightTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#5B348B', // Violet principal
      light: '#7A73A8',
      dark: '#3F3B6C',
    },
    secondary: {
      main: '#CCAA1D', // Jaune moutarde
      light: '#E6C545',
      dark: '#B39516',
    },
    background: {
      default: '#F7F3F7', // Fond clair
      paper: '#FFFFFF',
    },
    text: {
      primary: '#23272A', // Texte principal en gris foncé
      secondary: '#5B348B', // Texte secondaire en violet
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#23272A',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Exo 2", "Arial", sans-serif',
          textTransform: 'none',
          color: '#23272A',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#23272A',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          subtitle1: 'h5',
          subtitle2: 'h6',
          body1: 'p',
          body2: 'p',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#23272A',
          '&:hover': {
            color: '#5B348B',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#23272A',
          '&:hover': {
            color: '#5B348B',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
});

const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const;

export default themes; 