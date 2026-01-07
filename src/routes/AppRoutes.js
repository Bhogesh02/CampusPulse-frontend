import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/auth/authSelectors';

import ProtectedRoute from '../utils/ProtectedRoute';
import PublicRoute from '../utils/PublicRoute';
import Layout from '../components/PageLayout/Layout';

// Pages
import SelectPortal from '../pages/auth/SelectPortal/SelectPortal';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/Register/Register';
import ForgotPassword from '../pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword/ResetPassword';
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
    return (
        <Routes>
            {/* Public Routes - Wrapped in PublicRoute to redirect if already logged in */}
            <Route path="/" element={
                <PublicRoute>
                    <Navigate to="/select-portal" replace />
                </PublicRoute>
            } />

            <Route path="/select-portal" element={
                <PublicRoute>
                    <SelectPortal />
                </PublicRoute>
            } />

            {/* Dynamic Role-based Auth Routes */}
            <Route path="/login/:role" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/register/:role" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />
            <Route path="/forgot-password/:role" element={
                <PublicRoute>
                    <ForgotPassword />
                </PublicRoute>
            } />
            <Route path="/reset-password/:token" element={
                <PublicRoute>
                    <ResetPassword />
                </PublicRoute>
            } />

            <Route path="/anonymous-complaint" element={<AnonymousComplaint />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Super Admin Portal */}
            <Route
                path="/super-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<SuperAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Mess Admin Portal */}
            <Route
                path="/mess-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['mess_admin']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<MessAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/mess-admin/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Hostel Admin Portal */}
            <Route
                path="/hostel-admin/*"
                element={
                    <ProtectedRoute allowedRoles={['hostel_admin']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<HostelAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/hostel-admin/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Student Portal */}
            <Route
                path="/student/*"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<StudentDashboard />} />
                                <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Legacy/Other Routes Support */}
            <Route
                path="/warden/*"
                element={
                    <ProtectedRoute allowedRoles={['warden']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<HostelAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/warden/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<SuperAdminDashboard />} />
                                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/select-portal" replace />} />
        </Routes>
    );
};

export default AppRoutes;
