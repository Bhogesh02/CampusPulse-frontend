import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { FiHome, FiAlertCircle, FiUsers, FiPieChart, FiTrendingUp, FiActivity, FiArrowRight } from 'react-icons/fi';
import AdminComplaints from '../../components/Complaints/AdminComplaints';
import UserManagement from '../../components/UserManagement/UserManagement';
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

const SuperAdminDashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-v2 super-admin-overview">
      <div className="welcome-section-v2">
        <div className="welcome-text">
          <h1>Sytem Control Center 🏛️</h1>
          <p>Global oversight of operations at {user?.collegeName}.</p>
        </div>
      </div>

      <div className="stats-row">
        <StatCard title="Total Residents" value="450" icon={FiUsers} color="blue" />
        <StatCard title="Global Complaints" value="12" icon={FiAlertCircle} color="orange" />
        <StatCard title="System Health" value="98%" icon={FiActivity} color="green" />
        <StatCard title="Avg Satisfaction" value="4.2" icon={FiTrendingUp} color="blue" />
      </div>

      <div className="dashboard-main-grid">
        <div className="primary-section">
          <div className="announcements-section">
            <h3>📈 Campus Performance Trends</h3>
            <div className="announcement-item">
              <span className="time">Real-time</span>
              <p>Hostel Wing B reporting 15% increase in maintenance efficiency.</p>
            </div>
            <div className="announcement-item">
              <span className="time">Monthly</span>
              <p>Mess feedback has stabilized at 4.5/5.0 across all dining halls.</p>
            </div>
          </div>

          <div className="announcements-section" style={{ marginTop: '2rem' }}>
            <h3>🛡️ Security & Access Logs</h3>
            <div className="announcement-item">
              <span className="time">Active</span>
              <p>3 New Admin accounts verified today.</p>
            </div>
            <div className="announcement-item">
              <span className="time">Alert</span>
              <p>Password reset policy updated for staff members.</p>
            </div>
          </div>
        </div>

        <div className="secondary-section">
          <div className="quick-actions-card">
            <h3>Global Commands</h3>
            <div className="action-links">
              <a href="/super-admin/users">Manage Administrative Staff</a>
              <a href="/super-admin/complaints">Global Complaint View</a>
              <a href="/super-admin/analytics">View Detailed Analytics</a>
              <a href="/super-admin/settings">Institutional Settings</a>
            </div>
          </div>

          <div className="info-card">
            <h3>Critical Metrics</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                  <span>Complaints Resolved</span>
                  <span>82%</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px' }}>
                  <div style={{ height: '100%', width: '82%', background: '#2563eb', borderRadius: '10px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                  <span>Feedback Quota</span>
                  <span>95%</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px' }}>
                  <div style={{ height: '100%', width: '95%', background: '#16a34a', borderRadius: '10px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
