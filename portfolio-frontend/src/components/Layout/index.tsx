import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Dashboard as DashboardIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { keyframes } from '@mui/system';

interface LayoutProps {
  children: React.ReactNode;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

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

const Layout: React.FC<LayoutProps> = ({ children, onToggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'A Propos', icon: <PersonIcon />, path: '/about' },
    { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
    { text: 'Charte Graphique', icon: <PaletteIcon />, path: '/style-guide' },
  ];

  // Ajouter le Dashboard uniquement pour les administrateurs
  if (user?.roles?.includes('ROLE_ADMIN')) {
    menuItems.push({ text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100%', 
      margin: 0, 
      padding: 0,
      background: isDarkMode 
        ? 'linear-gradient(-45deg, #5f358c, #181221, #5f358c)'
        : 'linear-gradient(-45deg, #f5f5f5, #e0e0e0, #f5f5f5)',
      backgroundSize: '400% 400%',
      animation: `${gradient} 8s ease infinite`
    }}>
      {/* Sidebar fixe */}
      <Box
        component="nav"
        sx={{
          width: isOpen ? '240px' : '80px',
          backgroundColor: theme => theme.palette.background.paper,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOpen ? 'flex-start' : 'center',
          py: 2,
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          borderRight: '2px solid #5B548B',
          transition: 'width 0.3s ease, align-items 0.3s ease',
          zIndex: 1000
        }}
      >
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: isOpen ? 'space-between' : 'center',
          alignItems: 'center',
          px: isOpen ? 2 : 0,
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src="/images/Profil-Picture.webp"
              alt={user?.firstName || "Profile"}
              sx={{
                width: 45,
                height: 45,
                border: '2px solid #5B548B',
              }}
            />
            {isOpen && user && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    ml: 2,
                    color: theme => theme.palette.text.primary,
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  {user.firstName}
                </Typography>
                <IconButton
                  onClick={handleLogout}
                  sx={{ 
                    ml: 1,
                    color: theme => theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          {isOpen && !user && (
            <Button
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                color: theme => theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Login
            </Button>
          )}
        </Box>

        <List sx={{ width: '100%', flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2 : 0,
                    justifyContent: 'center',
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: 1,
                      color: theme => theme.palette.text.primary,
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Bouton de thème */}
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          mt: 2 
        }}>
          <IconButton
            onClick={onToggleTheme}
            sx={{
              color: theme => theme.palette.text.primary,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        {isOpen && (
          <IconButton 
            onClick={() => setIsOpen(false)}
            sx={{ 
              color: theme => theme.palette.text.primary,
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: theme => theme.palette.background.paper,
              border: '2px solid #5B548B',
              '&:hover': {
                backgroundColor: theme => theme.palette.action.hover,
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        {!isOpen && (
          <IconButton 
            onClick={() => setIsOpen(true)}
            sx={{ 
              color: theme => theme.palette.text.primary,
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: theme => theme.palette.background.paper,
              border: '2px solid #5B548B',
              '&:hover': {
                backgroundColor: theme => theme.palette.action.hover,
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isOpen ? '240px' : '80px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease',
          p: 0,
          width: '100%',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 