/**
 * Student Dashboard Component
 * Read-only access to personal data
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  roomsAPI,
  complaintsAPI,
  feesAPI,
  attendanceAPI
} from '../../services/api';
import { toast } from 'react-toastify';
import '../../assets/styles/Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'Mess'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [roomsRes, complaintsRes, feesRes, attendanceRes] = await Promise.all([
        roomsAPI.getAll(),
        complaintsAPI.getAll(),
        feesAPI.getAll(),
        attendanceAPI.getAll()
      ]);

      setRoom(roomsRes.data[0] || null);
      setComplaints(complaintsRes.data);
      setFees(feesRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      await complaintsAPI.create(newComplaint);
      toast.success('Complaint submitted successfully');
      setNewComplaint({ title: '', description: '', category: 'Mess' });
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendancePercentage = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card">
            <p>Room Number</p>
            <h3>{room?.number || 'Not Assigned'}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Complaints</p>
            <h3>{complaints.filter(c => c.status === 'pending').length}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Fees</p>
            <h3>₹{fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0)}</h3>
          </div>
          <div className="stat-card">
            <p>Attendance</p>
            <h3>{attendancePercentage}%</h3>
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
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'room' ? 'active' : ''}
          onClick={() => setActiveTab('room')}
        >
          Room
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
        <button
          className={activeTab === 'attendance' ? 'active' : ''}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-header">My Profile</div>
            <div style={{ padding: '20px' }}>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Hostel ID:</strong> {user?.hostelId || 'Not Assigned'}</p>
              <p><strong>Room ID:</strong> {user?.roomId || 'Not Assigned'}</p>
            </div>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="card">
            <div className="card-header">Room Details</div>
            {room ? (
              <div style={{ padding: '20px' }}>
                <p><strong>Room Number:</strong> {room.number}</p>
                <p><strong>Capacity:</strong> {room.capacity}</p>
                <p><strong>Occupied:</strong> {room.occupied}</p>
                <p><strong>Vacant:</strong> {room.capacity - room.occupied}</p>
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                <p>No room assigned yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            <div className="card">
              <div className="card-header">Raise New Complaint</div>
              <form onSubmit={handleSubmitComplaint} style={{ padding: '20px' }}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  >
                    <option value="Mess">Mess</option>
                    <option value="Room">Room</option>
                    <option value="Water">Water</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Cleanliness">Cleanliness</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Complaint</button>
              </form>
            </div>

            <div className="card">
              <div className="card-header">My Complaints</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
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
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="card">
            <div className="card-header">My Fees</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee.id}>
                    <td>{fee.id}</td>
                    <td>₹{fee.amount}</td>
                    <td>
                      <span className={`badge badge-${fee.status === 'paid' ? 'success' : 'warning'}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>{fee.dueDate}</td>
                    <td>{fee.paidDate || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="card">
            <div className="card-header">My Attendance</div>
            <div style={{ padding: '20px', marginBottom: '20px' }}>
              <p><strong>Total Records:</strong> {attendance.length}</p>
              <p><strong>Present:</strong> {presentCount}</p>
              <p><strong>Absent:</strong> {attendance.length - presentCount}</p>
              <p><strong>Percentage:</strong> {attendancePercentage}%</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>
                      <span className={`badge badge-${record.status === 'present' ? 'success' : 'danger'}`}>
                        {record.status}
                      </span>
                    </td>
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

export default StudentDashboard;
