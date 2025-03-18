import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../store/slices/authSlice';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser() as any);
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer; 