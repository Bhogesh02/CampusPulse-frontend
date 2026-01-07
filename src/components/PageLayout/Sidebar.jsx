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
        { label: 'User Management', path: '/super-admin/users', icon: FiUsers },
        { label: 'All Complaints', path: '/super-admin/complaints', icon: FiAlertCircle },
        { label: 'Global Analytics', path: '/super-admin/analytics', icon: FiBarChart2 },
    ],
    'hostel_admin': [
        { label: 'Dashboard', path: '/hostel-admin/dashboard', icon: FiGrid },
        { label: 'Hostel Complaints', path: '/hostel-admin/complaints', icon: FiAlertCircle },
        { label: 'Resident Stats', path: '/hostel-admin/stats', icon: FiBarChart2 },
    ],
    'mess_admin': [
        { label: 'Dashboard', path: '/mess-admin/dashboard', icon: FiGrid },
        { label: 'Mess Complaints', path: '/mess-admin/complaints', icon: FiAlertCircle },
        { label: 'Menu Manager', path: '/mess-admin/menu', icon: FiFileText },
    ],
    'student': [
        { label: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
        { label: 'Mess Menu', path: '/student/mess-menu', icon: FiPieChart },
        { label: 'My Complaints', path: '/student/complaints', icon: FiAlertCircle },
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
