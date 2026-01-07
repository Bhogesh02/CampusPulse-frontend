import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
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

const MessAdminDashboard = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock Stats
  const stats = {
    total: 24,
    pending: 5,
    resolved: 19,
    critical: 2
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Mess Admin Dashboard 🍽️</h1>
        <p>Manage food quality and mess-related feedback.</p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', fontSize: '0.9rem', display: 'inline-block' }}>
          🔒 <strong>Privacy Mode:</strong> Student identities are hidden in reports.
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          <StatCard title="Total Feedback" value={stats.total} icon={FiMessageSquare} color="blue" />
          <StatCard title="Pending Review" value={stats.pending} icon={FiClock} color="orange" />
          <StatCard title="Resolved" value={stats.resolved} icon={FiCheckCircle} color="green" />
          <StatCard title="Critical Issues" value={stats.critical} icon={FiAlertCircle} color="red" />
        </div>
      )}

      <div className="dashboard-tabs">
        {['overview', 'complaints', 'menu', 'inventory'].map(tab => (
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
        {activeTab === 'complaints' && (
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Mess Complaints</h2>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 101, category: "Food Quality", severity: "Medium", status: "Pending" },
                    { id: 102, category: "Cleanliness", severity: "High", status: "Resolved" }
                  ].map(c => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.category}</td>
                      <td><span className={`badge badge-${c.severity === 'High' ? 'danger' : 'info'}`}>{c.severity}</span></td>
                      <td><span className={`badge badge-${c.status === 'Resolved' ? 'success' : 'warning'}`}>{c.status}</span></td>
                      <td><button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs... */}
        {activeTab === 'menu' && (
          <div className="content-card">
            <div className="card-header"><h2>Weekly Menu</h2></div>
            <div className="card-body"><p>Menu management interface.</p></div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="content-card">
            <div className="card-header"><h2>Mess Inventory</h2></div>
            <div className="card-body"><p>Stock tracking interface.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessAdminDashboard;
