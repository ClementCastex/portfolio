import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  type: AlertColor;
}

interface ShowNotificationProps {
  message: string;
  type?: AlertColor;
  autoHideDuration?: number;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showNotification = useCallback(({
    message,
    type = 'info',
    autoHideDuration = 6000,
  }: ShowNotificationProps) => {
    setNotification({
      open: true,
      message,
      type,
    });

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification();
    }, autoHideDuration);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};

export type NotificationHook = ReturnType<typeof useNotification>; 