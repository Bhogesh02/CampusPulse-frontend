import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { usersAPI, hostelsAPI, complaintsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiHome, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import '../../assets/styles/DashboardCommons.scss';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="stat-card">
    <div className="content">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
    <div className={`icon-box ${color}`}>
      <Icon />
    </div>
  </div>
);

const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('overview');

  // Data State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Mock loading
    setLoading(false);
  }, []);

  const handleDeleteUser = (id) => {
    toast.info("Delete functionality disabled in demo");
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Super Admin Dashboard 🛡️</h1>
        <p>Overview of system performance and user management.</p>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          <StatCard title="Total Students" value="1,204" icon={FiUsers} color="blue" />
          <StatCard title="Total Hostels" value="8" icon={FiHome} color="purple" />
          <StatCard title="Active Complaints" value="42" icon={FiAlertCircle} color="orange" />
          <StatCard title="Revenue (Monthly)" value="₹12.5L" icon={FiTrendingUp} color="green" />
        </div>
      )}

      <div className="dashboard-tabs">
        {['overview', 'users', 'hostels', 'complaints', 'fees'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'users' && (
          <div className="content-card">
            <div className="card-header">
              <h2>User Management</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: "John Doe", email: "john@uni.edu", role: "Student", status: "Active" },
                    { id: 2, name: "Dr. Smith", email: "smith@uni.edu", role: "Warden", status: "Active" }
                  ].map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-info">{u.role}</span></td>
                      <td><span className="badge badge-success">{u.status}</span></td>
                      <td>
                        <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#ef4444' }} onClick={() => handleDeleteUser(u.id)}>Disable</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs placeholders */}
        {activeTab === 'hostels' && (
          <div className="content-card">
            <div className="card-header"><h2>Hostel Management</h2></div>
            <div className="card-body"><p>Hostel list will appear here.</p></div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="content-card">
            <div className="card-header"><h2>System Complaints</h2></div>
            <div className="card-body"><p>Global complaints view.</p></div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="content-card">
            <div className="card-header"><h2>Financial Overview</h2></div>
            <div className="card-body"><p>Fee collection details.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
