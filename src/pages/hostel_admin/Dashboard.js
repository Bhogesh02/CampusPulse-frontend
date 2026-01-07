import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { FiHome, FiAlertCircle, FiUsers, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import '../../assets/styles/DashboardCommons.scss';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`stat-card-v2 ${color}`}>
    <div className="stat-content">
      <span className="stat-label">{title}</span>
      <h3 className="stat-value">{value}</h3>
    </div>
    <div className="stat-icon">
      <Icon />
    </div>
  </div>
);

const HostelAdminDashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-v2">
      <div className="welcome-section-v2">
        <div className="welcome-text">
          <h1>Hostel Management Overview 🏠</h1>
          <p>Oversee resident welfare and maintain hostel facilities at {user?.collegeName}.</p>
        </div>
      </div>

      <div className="stats-row">
        <StatCard title="Total Residents" value="124" icon={FiUsers} color="blue" />
        <StatCard title="Active Complaints" value="8" icon={FiAlertCircle} color="orange" />
        <StatCard title="Resolved This Month" value="45" icon={FiCheckCircle} color="green" />
        <StatCard title="Avg Resolution Time" value="4.2h" icon={FiBarChart2} color="blue" />
      </div>

      <div className="dashboard-main-grid">
        <div className="primary-section">
          <div className="announcements-section">
            <h3>📋 Recent Activities</h3>
            <div className="announcement-item">
              <span className="time">10:30 AM</span>
              <p>Plumbing repair completed for Room B-204.</p>
            </div>
            <div className="announcement-item">
              <span className="time">Yesterday</span>
              <p>New resident "Rahul Sharma" checked in to Room A-105.</p>
            </div>
            <div className="announcement-item">
              <span className="time">2 days ago</span>
              <p>Monthly fire safety inspection completed successfully.</p>
            </div>
          </div>
        </div>

        <div className="secondary-section">
          <div className="quick-actions-card">
            <h3>Admin Shortcuts</h3>
            <div className="action-links">
              <a href="/hostel-admin/complaints">Manage Maintenance Issues</a>
              <a href="/hostel-admin/stats">View Resident Analytics</a>
              <a href="/profile">My Account Profile</a>
            </div>
          </div>

          <div className="info-card">
            <h3>Upcoming Tasks</h3>
            <ul style={{ padding: '0', listStyle: 'none' }}>
              <li style={{ color: '#64748b', marginBottom: '10px' }}>• Water tank cleaning: Saturday</li>
              <li style={{ color: '#64748b', marginBottom: '10px' }}>• Pest control (Wing A): Monday</li>
              <li style={{ color: '#64748b' }}>• Electricity bill submission: 15th Jan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelAdminDashboard;
