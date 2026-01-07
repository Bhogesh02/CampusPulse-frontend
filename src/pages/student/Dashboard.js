import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { complaintsAPI, feesAPI, attendanceAPI, roomsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiHome, FiAlertCircle, FiDollarSign, FiClock, FiUser } from 'react-icons/fi';
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

const StudentDashboard = () => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // State
  const [room, setRoom] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [newComplaint, setNewComplaint] = useState({
    title: '', description: '', category: 'Mess'
  });

  useEffect(() => {
    // Simulate API calls or uncomment real ones
    setLoading(false);
  }, []);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      // await complaintsAPI.create(newComplaint);
      toast.success('Complaint submitted successfully');
      setNewComplaint({ title: '', description: '', category: 'Mess' });
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendancePercentage = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Hello, {user?.firstName}! 👋</h1>
        <p>Here's what's happening with your hostel account.</p>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          <StatCard
            title="Room Number"
            value={room?.number || 'N/A'}
            icon={FiHome}
            color="blue"
          />
          <StatCard
            title="Pending Complaints"
            value={complaints.filter(c => c.status === 'pending').length}
            icon={FiAlertCircle}
            color="orange"
          />
          <StatCard
            title="Due Fees"
            value={`₹${fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0)}`}
            icon={FiDollarSign}
            color="purple"
          />
          <StatCard
            title="Attendance"
            value={`${attendancePercentage}%`}
            icon={FiClock}
            color="green"
          />
        </div>
      )}

      <div className="dashboard-tabs">
        {['overview', 'profile', 'room', 'complaints', 'fees', 'attendance'].map(tab => (
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
        {activeTab === 'profile' && (
          <div className="content-card">
            <div className="card-header">
              <h2>My Profile</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <p><strong>Full Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> Student</p>
                <p><strong>Student ID:</strong> {user?.studentId || 'N/A'}</p>
                <p><strong>College:</strong> {user?.collegeName || 'N/A'}</p>
                <p><strong>Phone:</strong> {user?.mobile || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="content-card">
              <div className="card-header">
                <h2>Raise New Complaint</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitComplaint}>
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
                      rows="3"
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">Submit Complaint</button>
                </form>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h2>Recent Complaints</h2>
              </div>
              <div className="card-body">
                {complaints.length === 0 ? (
                  <p className="text-muted">No complaints found.</p>
                ) : (
                  <table>
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
                      {complaints.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.title}</td>
                          <td>{c.category}</td>
                          <td><span className={`badge badge-${c.status === 'resolved' ? 'success' : 'warning'}`}>{c.status}</span></td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs follow similar structure using content-card */}
        {activeTab === 'fees' && (
          <div className="content-card">
            <div className="card-header"><h2>Fee History</h2></div>
            <div className="card-body">
              <p>No fee records found.</p>
            </div>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="content-card">
            <div className="card-header"><h2>Room Details</h2></div>
            <div className="card-body">
              <p>No room assigned.</p>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="content-card">
            <div className="card-header"><h2>Attendance Record</h2></div>
            <div className="card-body">
              <p>No attendance records found.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
