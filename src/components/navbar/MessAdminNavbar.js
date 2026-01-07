/**
 * Mess Admin Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const MessAdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/mess-admin/dashboard">Hostel Management</Link>
          <span className="navbar-role">Mess Admin</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/mess-admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/mess-admin/dashboard#complaints">Complaints</Link>
          </li>
        </ul>

        <div className="navbar-user">
          <span>{user?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MessAdminNavbar;
