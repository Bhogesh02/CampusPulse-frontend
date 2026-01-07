/**
 * Admin Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const AdminNavbar = () => {
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
          <Link to="/admin/dashboard">Hostel Management</Link>
          <span className="navbar-role">Admin</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/dashboard#users">Users</Link>
          </li>
          <li>
            <Link to="/admin/dashboard#hostels">Hostels</Link>
          </li>
          <li>
            <Link to="/admin/dashboard#complaints">Complaints</Link>
          </li>
          <li>
            <Link to="/admin/dashboard#fees">Fees</Link>
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

export default AdminNavbar;
