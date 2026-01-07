import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './layout.scss';

// Optional: Chatbot import if desired here, or keep in MainLayout
import FloatingChatbot from '../chatbot/FloatingChatbot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="page-layout">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <div className={`main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar />

                <main className="page-content">
                    {children}
                </main>

                {/* Shared UI Components */}
                <FloatingChatbot />
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
        </div>
    );
};

export default Layout;
