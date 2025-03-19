import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import themes from './theme/index';
import { store } from './store';
import Layout from './components/Layout';
import Router from './Router';
import { AlertColor } from '@mui/material';
import CustomSnackbar from './components/CustomSnackbar';

// Contexte pour les notifications
interface NotificationContextProps {
  showNotification: (message: string, type?: AlertColor, duration?: number) => void;
}

export const NotificationContext = React.createContext<NotificationContextProps>({
  showNotification: () => {},
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode ? savedMode === 'dark' : true;
  });

  // État pour les notifications
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<AlertColor>('info');
  const [notificationDuration, setNotificationDuration] = useState(6000);

  const showNotification = (
    message: string,
    type: AlertColor = 'info',
    duration: number = 6000
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationDuration(duration);
    setNotificationOpen(true);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={isDarkMode ? themes.dark : themes.light}>
        <CssBaseline />
        <NotificationContext.Provider value={{ showNotification }}>
          <BrowserRouter>
            <Layout onToggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode}>
              <Router />
            </Layout>
          </BrowserRouter>
          
          {/* Snackbar global pour les notifications */}
          <CustomSnackbar
            open={notificationOpen}
            message={notificationMessage}
            type={notificationType}
            autoHideDuration={notificationDuration}
            onClose={handleCloseNotification}
          />
        </NotificationContext.Provider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
