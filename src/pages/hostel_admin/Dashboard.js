/**
 * Warden Dashboard Component
 * Manage assigned hostel only
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  hostelsAPI,
  roomsAPI,
  complaintsAPI,
  attendanceAPI,
  usersAPI
} from '../../services/api';
import { toast } from 'react-toastify';
import '../../assets/styles/Dashboard.css';

const WardenDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [hostelsRes, roomsRes, complaintsRes, attendanceRes, usersRes] = await Promise.all([
        hostelsAPI.getAll(),
        roomsAPI.getAll(),
        complaintsAPI.getAll(),
        attendanceAPI.getAll(),
        usersAPI.getAll()
      ]);

      setHostel(hostelsRes.data[0] || null);
      setRooms(roomsRes.data);
      setComplaints(complaintsRes.data);
      setAttendance(attendanceRes.data);

      // Filter students in warden's hostel
      if (hostelsRes.data[0]) {
        const hostelStudents = usersRes.data.filter(
          u => u.role === 'student' && u.hostelId === hostelsRes.data[0].id
        );
        setStudents(hostelStudents);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (!hostel) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Warden Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="card">
          <p>You are not assigned to any hostel yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Warden Dashboard</h1>
        <p>Welcome, {user?.name} - Managing {hostel?.name}</p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="stats-grid">
          <div className="stat-card">
            <p>Hostel Capacity</p>
            <h3>{hostel?.capacity || 0}</h3>
          </div>
          <div className="stat-card">
            <p>Occupied</p>
            <h3>{hostel?.occupied || 0}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Complaints</p>
            <h3>{complaints.filter(c => c.status === 'pending').length}</h3>
          </div>
          <div className="stat-card">
            <p>Total Students</p>
            <h3>{students.length}</h3>
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
          className={activeTab === 'hostel' ? 'active' : ''}
          onClick={() => setActiveTab('hostel')}
        >
          Hostel Info
        </button>
        <button
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
        </button>
        <button
          className={activeTab === 'complaints' ? 'active' : ''}
          onClick={() => setActiveTab('complaints')}
        >
          Complaints
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
        {activeTab === 'hostel' && (
          <div className="card">
            <div className="card-header">Hostel Information</div>
            <div style={{ padding: '20px' }}>
              <p><strong>Name:</strong> {hostel.name}</p>
              <p><strong>Capacity:</strong> {hostel.capacity}</p>
              <p><strong>Occupied:</strong> {hostel.occupied}</p>
              <p><strong>Vacant:</strong> {hostel.capacity - hostel.occupied}</p>
              <p><strong>Warden ID:</strong> {hostel.wardenId}</p>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card">
            <div className="card-header">Students in Hostel</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Room ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.roomId || 'Not Assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="card">
            <div className="card-header">Rooms</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Vacant</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.number}</td>
                    <td>{room.capacity}</td>
                    <td>{room.occupied}</td>
                    <td>{room.capacity - room.occupied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="card">
            <div className="card-header">Hostel Complaints</div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Student ID</th>
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

        {activeTab === 'attendance' && (
          <div className="card">
            <div className="card-header">Student Attendance</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td>{record.studentId}</td>
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

export default WardenDashboard;
