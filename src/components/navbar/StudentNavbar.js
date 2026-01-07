/**
 * Student Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const StudentNavbar = () => {
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
          <Link to="/student/dashboard">Hostel Management</Link>
          <span className="navbar-role">Student</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/student/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/student/dashboard#profile">Profile</Link>
          </li>
          <li>
            <Link to="/student/dashboard#room">Room</Link>
          </li>
          <li>
            <Link to="/student/dashboard#complaints">Complaints</Link>
          </li>
          <li>
            <Link to="/student/dashboard#fees">Fees</Link>
          </li>
          <li>
            <Link to="/student/dashboard#attendance">Attendance</Link>
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

export default StudentNavbar;
