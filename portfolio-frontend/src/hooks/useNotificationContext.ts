import { useContext } from 'react';
import { NotificationContext } from '../App';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  
  return context;
}; 