import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, selectAuthLoading } from '../store/auth/authSelectors';

/**
 * ProtectedRoute component
 * Ensures only authenticated users with correct roles can access specific pages
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // If still loading auth state, show a consistent loader
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: '500' }}>Checking authentication...</p>
        <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/select-portal" state={{ from: location }} replace />;
  }

  // Role check logic
  const userRole = user.role;

  // Normalize role check (handle potential hyphen vs underscore inconsistencies)
  const normalizedUserRole = userRole?.replace('-', '_');
  const normalizedAllowedRoles = allowedRoles.map(r => r.replace('-', '_'));

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
