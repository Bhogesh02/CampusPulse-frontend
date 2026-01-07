import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/auth/authSelectors';

/**
 * PublicRoute component
 * Redirects authenticated users to their respective dashboards
 * Prevent access to Login, Register, SelectPortal, etc. for logged-in users
 */
const PublicRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const location = useLocation();

    if (isAuthenticated && user) {
        // Redirect based on role
        const role = user.role;
        switch (role) {
            case 'super_admin':
            case 'admin':
                return <Navigate to="/super-admin/dashboard" replace />;
            case 'student':
                return <Navigate to="/student/dashboard" replace />;
            case 'hostel_admin':
            case 'warden':
                return <Navigate to="/hostel-admin/dashboard" replace />;
            case 'mess_admin':
                return <Navigate to="/mess-admin/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PublicRoute;
