import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid, FiFileText, FiMessageSquare, FiUsers,
    FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight,
    FiPieChart, FiTrendingUp, FiAlertCircle
} from 'react-icons/fi';
import './sidebar.scss';
import logoIcon from '../../assets/images/logoIcon.png';

// Import Selectors if needed, but passing role as prop makes it more reusable
// For now, let's assume parent Layout handles role fetch or we use useSelector here
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';

/**
 * Configuration for Sidebar Menus based on User Role
 */
const MENU_CONFIG = {
    'super_admin': [
        { label: 'Dashboard', path: '/super-admin/dashboard', icon: FiGrid },
        { label: 'Complaints', path: '/super-admin/complaints', icon: FiAlertCircle },
        { label: 'Feedback & Ratings', path: '/super-admin/feedback', icon: FiMessageSquare },
        { label: 'User Management', path: '/super-admin/users', icon: FiUsers },
        { label: 'Analytics', path: '/super-admin/analytics', icon: FiBarChart2 },
        { label: 'Reports', path: '/super-admin/reports', icon: FiPieChart },
        { label: 'College Settings', path: '/super-admin/settings', icon: FiSettings },
    ],
    'hostel_admin': [
        { label: 'Dashboard', path: '/hostel-admin/dashboard', icon: FiGrid },
        { label: 'Complaints', path: '/hostel-admin/complaints', icon: FiAlertCircle },
        { label: 'Trends', path: '/hostel-admin/trends', icon: FiTrendingUp },
    ],
    'mess_admin': [
        { label: 'Dashboard', path: '/mess-admin/dashboard', icon: FiGrid },
        { label: 'Complaints', path: '/mess-admin/complaints', icon: FiAlertCircle },
        { label: 'Feedback', path: '/mess-admin/feedback', icon: FiMessageSquare },
        { label: 'Trends', path: '/mess-admin/trends', icon: FiTrendingUp },
    ],
    'student': [
        { label: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
        { label: 'Raise Complaint', path: '/student/complaint/new', icon: FiFileText },
        { label: 'My Complaints', path: '/student/complaints', icon: FiAlertCircle },
        { label: 'Feedback', path: '/student/feedback', icon: FiMessageSquare },
    ]
};

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const user = useSelector(selectUser);
    const role = user?.role || 'student'; // Default fallback

    // Normalize role to match config keys (backend might send super-admin or super_admin)
    const normalizedRole = role.replace('-', '_');
    const menuItems = MENU_CONFIG[normalizedRole] || [];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="logo-section">
                <div className="brand">
                    <img src={logoIcon} alt="Logo" />
                    <span>CampusPulse</span>
                </div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            <nav className="menu-section">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon className="menu-icon" />
                        <span className="menu-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
