import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { FiHome, FiAlertCircle, FiClock, FiCoffee, FiSun, FiMoon } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import NotificationScheduler from '../../components/Notifications/NotificationScheduler';
import MealPicker from '../../components/Schedule/MealPicker';
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

const TodayFoodCard = () => {
  const [todayMenu, setTodayMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayMenu = async () => {
      try {
        const response = await api.get('/schedule/latest');
        if (response.data) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const todayName = days[new Date().getDay()];
          const dayMenu = response.data.menu.find(m => m.day === todayName);
          setTodayMenu(dayMenu);
        }
      } catch (error) {
        console.error('Failed to fetch today menu');
      } finally {
        setLoading(false);
      }
    };
    fetchTodayMenu();
  }, []);

  if (loading) return <div className="food-card-loading">Loading today's menu...</div>;
  if (!todayMenu) return null;

  return (
    <div className="today-food-card">
      <div className="card-header">
        <h3>🍴 Today's Menu</h3>
        <span className="date-tag">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
      </div>
      <div className="meals-grid">
        <div className="meal-item">
          <div className="meal-icon"><FiCoffee /></div>
          <div className="meal-details">
            <label>Breakfast</label>
            <p>{todayMenu.breakfast.veg || 'Not specified'}</p>
          </div>
        </div>
        <div className="meal-item">
          <div className="meal-icon"><FiSun /></div>
          <div className="meal-details">
            <label>Lunch</label>
            <p>{todayMenu.lunch.veg || 'Not specified'}</p>
          </div>
        </div>
        <div className="meal-item">
          <div className="meal-icon"><FiMoon /></div>
          <div className="meal-details">
            <label>Dinner</label>
            <p>{todayMenu.dinner.veg || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-v2 student-overview">
      <NotificationScheduler />

      <div className="welcome-section-v2">
        <div className="welcome-text">
          <h1>Hello, {user?.firstName || 'Student'}! 👋</h1>
          <p>Welcome to your CampusPulse dashboard. Here's a quick look at your day.</p>
        </div>
      </div>

      <div className="overview-content">
        <div className="stats-row">
          <StatCard title="Hostel Room" value={user?.roomNumber || 'A-102'} icon={FiHome} color="blue" />
          <StatCard title="Pending Complaints" value="2" icon={FiAlertCircle} color="orange" />
          <StatCard title="Overall Attendance" value="94%" icon={FiClock} color="green" />
        </div>

        <div className="dashboard-main-grid">
          <div className="primary-section">
            <TodayFoodCard />
            <MealPicker />

            <div className="announcements-section">
              <h3>📢 Announcements</h3>
              <div className="announcement-item">
                <span className="time">2h ago</span>
                <p>Water tank cleaning scheduled for tomorrow 10 AM to 2 PM. Please store water.</p>
              </div>
              <div className="announcement-item">
                <span className="time">1d ago</span>
                <p>New Mess Menu for the upcoming week has been published. Check the Mess Menu tab.</p>
              </div>
            </div>
          </div>

          <div className="secondary-section">
            <div className="quick-actions-card">
              <h3>Quick Help</h3>
              <div className="action-links">
                <a href="/student/complaints">Raise a Complaint</a>
                <a href="/student/mess-menu">View Full Menu</a>
                <a href="/profile">Update Profile</a>
              </div>
            </div>

            <div className="mess-timings-card">
              <h3>Mess Timings</h3>
              <div className="timing-item">
                <span>Breakfast</span>
                <strong>08:00 - 10:00</strong>
              </div>
              <div className="timing-item">
                <span>Lunch</span>
                <strong>13:00 - 15:00</strong>
              </div>
              <div className="timing-item">
                <span>Dinner</span>
                <strong>20:00 - 22:00</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
