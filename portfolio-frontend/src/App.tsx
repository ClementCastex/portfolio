import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import themes from "./theme/index";
import { store } from "./store";
import Layout from "./components/Layout";
import Router from "./Router";
import { AlertColor } from "@mui/material";
import CustomSnackbar from "./components/CustomSnackbar";

// Composant pour masquer le bouton Google
const HideGoogleButton = () => {
  useEffect(() => {
    // Fonction pour masquer le bouton Google
    const hideGoogleButton = () => {
      // Sélecteurs plus complets pour cibler le bouton Google
      const possibleSelectors = [
        'button[contains(text(),"Google")]',
        'button[class*="MuiButton"][class*="root"]:has(span:contains("Google"))',
        'div[role="button"]:has(span:contains("Google"))',
        'button.MuiButtonBase-root span:contains("Google")',
        'a[href*="google"]',
        ".MuiButton-root",
      ];

      // Recherche par texte dans tous les éléments
      document
        .querySelectorAll('button, a, div[role="button"]')
        .forEach((el) => {
          if (
            el.textContent?.includes("Google") ||
            el.textContent?.includes("google")
          ) {
            (el as HTMLElement).style.display = "none";
          }

          // Recherche par classe dans les boutons Material UI
          if (
            el.className &&
            (el.className.includes("MuiButton") ||
              el.className.includes("Mui")) &&
            el.textContent?.includes("Google")
          ) {
            (el as HTMLElement).style.display = "none";
          }
        });
    };

    // Exécuter immédiatement et répéter régulièrement
    hideGoogleButton();
    const interval = setInterval(hideGoogleButton, 1000); // Vérifier toutes les secondes

    // Observer les changements DOM
    const observer = new MutationObserver((mutations) => {
      hideGoogleButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
};

// Contexte pour les notifications
interface NotificationContextProps {
  showNotification: (
    message: string,
    type?: AlertColor,
    duration?: number
  ) => void;
}

export const NotificationContext =
  React.createContext<NotificationContextProps>({
    showNotification: () => {},
  });

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode === "dark" : true;
  });

  // État pour les notifications
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<AlertColor>("info");
  const [notificationDuration, setNotificationDuration] = useState(6000);

  const showNotification = (
    message: string,
    type: AlertColor = "info",
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
    localStorage.setItem("themeMode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={isDarkMode ? themes.dark : themes.light}>
        <CssBaseline />
        <HideGoogleButton />
        <NotificationContext.Provider value={{ showNotification }}>
          <BrowserRouter>
            <Layout
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              isDarkMode={isDarkMode}
            >
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
