import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/auth/authSelectors';
import { useAuth } from '../context/AuthContext'; // Legacy context support if needed or remove later
import ProtectedRoute from '../utils/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import SelectPortal from '../pages/auth/SelectPortal/SelectPortal';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/Register/Register';
import ForgotPassword from '../pages/auth/ForgotPassword/ForgotPassword';
import AnonymousComplaint from '../pages/complaints/AnonymousComplaint';

// Dashboard Portals
import SuperAdminDashboard from '../pages/super_admin/Dashboard';
import HostelAdminDashboard from '../pages/hostel_admin/Dashboard';
import MessAdminDashboard from '../pages/mess_admin/Dashboard';
import StudentDashboard from '../pages/student/Dashboard';

// Unauthorized Page Component
const Unauthorized = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
    </div>
);

const AppRoutes = () => {
    // We can use Redux state now for auth checks or keep using the Context wrapper if we want
    // For this step, I'm integrating the NEW routes but keeping the ProtectedRoute logic tied to Context 
    // to avoid breaking the entire app's auth guard unless we refactor ProtectedRoute too.
    // Ideally, ProtectedRoute should be updated to read from Redux store.

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/select-portal" replace />} />
            <Route path="/select-portal" element={<SelectPortal />} />

            {/* Dynamic Role-based Auth Routes */}
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register/:role" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/anonymous-complaint" element={<AnonymousComplaint />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Super Admin Portal */}
            <Route
                path="/super-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<SuperAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Mess Admin Portal */}
            <Route
                path="/mess-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['mess_admin']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<MessAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/mess-admin/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Hostel Admin Portal */}
            <Route
                path="/hostel-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['hostel_admin']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<HostelAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/hostel-admin/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Student Portal */}
            <Route
                path="/student/*"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<StudentDashboard />} />
                                <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Legacy/Other Routes Support */}
            <Route
                path="/warden/*"
                element={
                    <ProtectedRoute allowedRoles={['warden']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<HostelAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/warden/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                        <MainLayout>
                            <Routes>
                                <Route path="dashboard" element={<SuperAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/select-portal" replace />} />
        </Routes>
    );
};

export default AppRoutes;
