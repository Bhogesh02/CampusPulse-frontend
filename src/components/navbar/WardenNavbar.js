/**
 * Warden Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const WardenNavbar = () => {
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
          <Link to="/warden/dashboard">Hostel Management</Link>
          <span className="navbar-role">Warden</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/warden/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/warden/dashboard#hostel">Hostel</Link>
          </li>
          <li>
            <Link to="/warden/dashboard#students">Students</Link>
          </li>
          <li>
            <Link to="/warden/dashboard#complaints">Complaints</Link>
          </li>
          <li>
            <Link to="/warden/dashboard#rooms">Rooms</Link>
          </li>
          <li>
            <Link to="/warden/dashboard#attendance">Attendance</Link>
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

export default WardenNavbar;
