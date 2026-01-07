import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext';
import FloatingChatbot from '../chatbot/FloatingChatbot';
import AdminNavbar from '../navbar/AdminNavbar';
import StudentNavbar from '../navbar/StudentNavbar';
import WardenNavbar from '../navbar/WardenNavbar';

// Assuming styles are moved, or we import from root for now if not moved yet
// import '../../assets/styles/App.css'; 

const MainLayout = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    const renderNavbar = () => {
        if (!isAuthenticated()) return null;

        switch (user?.role) {
            case 'super_admin':
            case 'admin':
                return <AdminNavbar />;
            case 'mess_admin':
                return <AdminNavbar />; // Can be specialized later
            case 'hostel_admin':
                return <WardenNavbar />;
            case 'student':
                return <StudentNavbar />;
            case 'warden':
                return <WardenNavbar />;
            default:
                return null; // Or a default GuestNavbar
        }
    };

    return (
        <div className="app-container">
            {renderNavbar()}
            <main className="main-content">
                {children}
            </main>
            {isAuthenticated() && <FloatingChatbot />}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default MainLayout;
