import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors'; // Corrected import based on file structure
import { toast } from 'react-toastify';
import { FiHome, FiUsers, FiClipboard, FiCheckCircle } from 'react-icons/fi';
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

const WardenDashboard = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('overview');

  // Data State
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    setLoading(false);
    // Mock hostel data
    setHostel({
      name: "Block A - Boys Hostel",
      capacity: 200,
      occupied: 185
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Hostel Admin Dashboard 🏢</h1>
        <p>Managing {hostel?.name || "your assigned hostel"}.</p>
      </div>

      {activeTab === 'overview' && (
        <div className="stats-grid">
          <StatCard title="Total Capacity" value={hostel?.capacity || 0} icon={FiHome} color="blue" />
          <StatCard title="Students" value={hostel?.occupied || 0} icon={FiUsers} color="green" />
          <StatCard title="Vacant Beds" value={(hostel?.capacity - hostel?.occupied) || 0} icon={FiCheckCircle} color="purple" />
          <StatCard title="Complaints" value="5" icon={FiClipboard} color="orange" />
        </div>
      )}

      <div className="dashboard-tabs">
        {['overview', 'rooms', 'students', 'complaints', 'attendance'].map(tab => (
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
        {activeTab === 'students' && (
          <div className="content-card">
            <div className="card-header">
              <h2>Student List</h2>
            </div>
            <div className="card-body">
              <p>No students to display yet.</p>
            </div>
          </div>
        )}

        {/* Other tabs... */}
        {activeTab === 'rooms' && (
          <div className="content-card">
            <div className="card-header"><h2>Room Allocation</h2></div>
            <div className="card-body"><p>Room allocation grid.</p></div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="content-card">
            <div className="card-header"><h2>Hostel Complaints</h2></div>
            <div className="card-body"><p>Manage student complaints here.</p></div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="content-card">
            <div className="card-header"><h2>Daily Attendance</h2></div>
            <div className="card-body"><p>Attendance marking interface.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenDashboard;
