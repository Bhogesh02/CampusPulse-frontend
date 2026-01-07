/**
 * Admin Dashboard Component
 * Full control over all data
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  usersAPI,
  hostelsAPI,
  complaintsAPI,
  feesAPI,
  analyticsAPI
} from '../../services/api';
import { toast } from 'react-toastify';
import '../../assets/styles/Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, hostelsRes, complaintsRes, feesRes] = await Promise.all([
        analyticsAPI.getStats(),
        usersAPI.getAll(),
        hostelsAPI.getAll(),
        complaintsAPI.getAll(),
        feesAPI.getAll()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setHostels(hostelsRes.data);
      setComplaints(complaintsRes.data);
      setFees(feesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUpdateComplaint = async (id, status) => {
    try {
      await complaintsAPI.update(id, { status });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Complaint updated');
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
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      {/* Statistics Cards */}
      {activeTab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Students</p>
            <h3>{stats.totalStudents || 0}</h3>
          </div>
          <div className="stat-card">
            <p>Total Wardens</p>
            <h3>{stats.totalWardens || 0}</h3>
          </div>
          <div className="stat-card">
            <p>Total Hostels</p>
            <h3>{stats.totalHostels || 0}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Complaints</p>
            <h3>{stats.pendingComplaints || 0}</h3>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'hostels' ? 'active' : ''}
          onClick={() => setActiveTab('hostels')}
        >
          Hostels
        </button>
        <button
          className={activeTab === 'complaints' ? 'active' : ''}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints
        </button>
        <button
          className={activeTab === 'fees' ? 'active' : ''}
          onClick={() => setActiveTab('fees')}
        >
          Fees
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">All Users</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Hostel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'warden' ? 'warning' : 'info'}`}>{user.role}</span></td>
                    <td>{user.hostelId || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'hostels' && (
          <div className="card">
            <div className="card-header">All Hostels</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Vacant</th>
                  <th>Warden ID</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map(hostel => (
                  <tr key={hostel.id}>
                    <td>{hostel.id}</td>
                    <td>{hostel.name}</td>
                    <td>{hostel.capacity}</td>
                    <td>{hostel.occupied}</td>
                    <td>{hostel.capacity - hostel.occupied}</td>
                    <td>{hostel.wardenId || 'Not Assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="card">
            <div className="card-header">All Complaints</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Student ID</th>
                  <th>Hostel ID</th>
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
                      <span className={`badge badge-${complaint.status === 'resolved' ? 'success' :
                          complaint.status === 'in_progress' ? 'warning' : 'secondary'
                        }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{complaint.studentId}</td>
                    <td>{complaint.hostelId}</td>
                    <td>
                      <select
                        value={complaint.status}
                        onChange={(e) => handleUpdateComplaint(complaint.id, e.target.value)}
                        className="form-control"
                        style={{ width: 'auto', display: 'inline-block' }}
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
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="card">
            <div className="card-header">All Fees</div>
            <div className="stats-grid" style={{ marginBottom: '20px' }}>
              <div className="stat-card">
                <p>Total Fees</p>
                <h3>₹{stats.totalFees || 0}</h3>
              </div>
              <div className="stat-card">
                <p>Paid</p>
                <h3>₹{stats.paidFees || 0}</h3>
              </div>
              <div className="stat-card">
                <p>Pending</p>
                <h3>₹{stats.pendingFees || 0}</h3>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee.id}>
                    <td>{fee.id}</td>
                    <td>{fee.studentId}</td>
                    <td>₹{fee.amount}</td>
                    <td>
                      <span className={`badge badge-${fee.status === 'paid' ? 'success' : 'warning'}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>{fee.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
