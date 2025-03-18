import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import themes from './theme/index';
import { store } from './store';
import Layout from './components/Layout';
import Router from './Router';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={isDarkMode ? themes.dark : themes.light}>
        <CssBaseline />
        <BrowserRouter>
          <Layout onToggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode}>
            <Router />
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
