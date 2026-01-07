/**
 * Mess Admin Dashboard
 * View only Mess-related complaints (student identity hidden)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import '../../assets/styles/Dashboard.css';

const MessAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getAll();
      setComplaints(response.data);

      // Calculate stats
      setStats({
        total: response.data.length,
        pending: response.data.filter(c => c.status === 'pending').length,
        inProgress: response.data.filter(c => c.status === 'in_progress').length,
        resolved: response.data.filter(c => c.status === 'resolved').length,
        critical: response.data.filter(c => c.severity === 'critical').length
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintsAPI.update(id, { status });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Complaint status updated');
      loadComplaints();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🍽️ Mess Admin Dashboard</h1>
        <p>Welcome, {user?.name} - Managing Mess Complaints</p>
        <div className="admin-notice">
          <strong>⚠️ Note:</strong> Student identities are hidden for privacy.
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Complaints</p>
          <h3>{stats.total}</h3>
        </div>
        <div className="stat-card">
          <p>Pending</p>
          <h3>{stats.pending}</h3>
        </div>
        <div className="stat-card">
          <p>In Progress</p>
          <h3>{stats.inProgress}</h3>
        </div>
        <div className="stat-card">
          <p>Critical Issues</p>
          <h3>{stats.critical}</h3>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card">
        <div className="card-header">Mess Complaints</div>
        {complaints.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No mess complaints found.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Sentiment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.category}</td>
                  <td>
                    <span className={`badge badge-${complaint.severity === 'critical' ? 'danger' : 'info'}`}>
                      {complaint.severity || 'normal'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${complaint.sentiment === 'negative' ? 'danger' : complaint.sentiment === 'positive' ? 'success' : 'secondary'}`}>
                      {complaint.sentiment || 'neutral'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${complaint.status === 'resolved' ? 'success' :
                        complaint.status === 'in_progress' ? 'warning' : 'secondary'
                      }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                      className="form-control"
                      style={{ width: 'auto', display: 'inline-block', minWidth: '140px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Complaint Details Modal could be added here */}
    </div>
  );
};

export default MessAdminDashboard;
