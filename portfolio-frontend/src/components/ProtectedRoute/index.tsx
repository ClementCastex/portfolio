import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { loadUser } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = true }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser() as any);
    }
  }, [dispatch, token, user]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a les rôles nécessaires
  const hasAdminRole = user?.roles?.includes('ROLE_ADMIN');
  console.log('User roles:', user?.roles);
  console.log('Has admin role:', hasAdminRole);
  console.log('Require admin:', requireAdmin);

  if (requireAdmin && !hasAdminRole) {
    console.log('Access denied: User is not admin');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 