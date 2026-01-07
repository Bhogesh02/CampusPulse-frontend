import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, selectAuthLoading } from '../store/auth/authSelectors';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#64748b'
    }}>Authenticating...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/select-portal" state={{ from: location }} replace />;
  }

  // Role check logic
  // Ensure roles match backend "super_admin" vs "super-admin" or normalized
  // Backend uses underscore (super_admin), SelectPortal used hyphen (super-admin)
  // We should normalize or handle both
  const userRole = user.role;

  // allowedRoles comes from AppRoutes as ['super_admin', 'student', etc.] (underscore)
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
