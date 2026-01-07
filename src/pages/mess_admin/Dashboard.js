import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { FiHome, FiAlertCircle, FiCoffee, FiStar, FiPieChart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import LiveMealStats from '../../components/Schedule/LiveMealStats';
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

const MessAdminDashboard = () => {
  const user = useSelector(selectUser);
  const [stats, setStats] = useState({
    avgRating: '4.5',
    totalComplaints: '12',
    solvedComplaints: '8',
    todayFeedbacks: '42'
  });

  return (
    <div className="dashboard-v2">
      <div className="welcome-section-v2">
        <div className="welcome-text">
          <h1>Mess Operations Overview 🍽️</h1>
          <p>Monitor dining quality and manage your mess facility at {user?.collegeName}.</p>
        </div>
      </div>

      <div className="stats-row">
        <StatCard title="Average Rating" value={stats.avgRating} icon={FiStar} color="orange" />
        <StatCard title="Today's Feedbacks" value={stats.todayFeedbacks} icon={FiPieChart} color="blue" />
        <StatCard title="Open Complaints" value={stats.totalComplaints} icon={FiAlertCircle} color="orange" />
        <StatCard title="Resolved Issues" value={stats.solvedComplaints} icon={FiCheckCircle} color="green" />
      </div>

      <div className="dashboard-main-grid">
        <div className="primary-section">
          <div className="announcements-section">
            <h3>📈 Recent Feedback Trends</h3>
            <div className="announcement-item">
              <span className="time">Today</span>
              <p>Lunch (Veg Biryani) received high praise: Avg 4.8★</p>
            </div>
            <div className="announcement-item">
              <span className="time">Yesterday</span>
              <p>Breakfast delay reported by multiple students. Action taken: Staff meeting scheduled.</p>
            </div>
            <div className="announcement-item">
              <span className="time">2 days ago</span>
              <p>New Vendor for vegetables started delivery. Quality check passed.</p>
            </div>
          </div>
        </div>

        <div className="secondary-section">
          <LiveMealStats />
          <div className="quick-actions-card">
            <h3>Management Actions</h3>
            <div className="action-links">
              <a href="/mess-admin/menu">Upload Next Week Menu</a>
              <a href="/mess-admin/complaints">Review Pending Complaints</a>
              <a href="/profile">Administrative Settings</a>
            </div>
          </div>

          <div className="info-card">
            <h3>Inventory Alerts</h3>
            <ul style={{ padding: '0', listStyle: 'none' }}>
              <li style={{ color: '#ef4444', fontWeight: '600' }}>⚠️ Rice stock below 15%</li>
              <li style={{ color: '#64748b' }}>• Gas cylinders replenishment due: Friday</li>
              <li style={{ color: '#64748b' }}>• Deep cleaning scheduled for Sunday</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessAdminDashboard;
