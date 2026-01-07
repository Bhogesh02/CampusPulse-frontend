import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiMail, FiPhone, FiBook,
    FiShield, FiHome, FiMapPin, FiBriefcase,
    FiEdit3, FiLogOut, FiActivity, FiSettings,
    FiSmartphone, FiCalendar
} from 'react-icons/fi';
import { selectUser } from '../../store/auth/authSelectors';
import { logoutUser } from '../../store/auth/authActions';
import api from '../../store/api/axiosBase';
import '../../assets/styles/DashboardCommons.scss';
import './profile.scss';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(selectUser);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfileData(currentUser);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/select-portal');
    };

    if (isLoading) {
        return <div className="loading-state">Loading your profile...</div>;
    }

    const user = profileData || currentUser;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    const displayRole = user?.role?.replace('_', ' ').toUpperCase();

    return (
        <div className="dashboard-v2 profile-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Account Profile 👤</h1>
                    <p>Manage your personal information and security settings.</p>
                </div>
            </div>

            <div className="dashboard-main-grid">
                <div className="primary-section">
                    <div className="content-view-full" style={{ marginBottom: '2rem' }}>
                        <div className="profile-header-v2">
                            <div className="avatar-large">{initials}</div>
                            <div className="header-meta">
                                <h2>{user?.name}</h2>
                                <span className="role-tag">{displayRole}</span>
                                <p>{user?.email}</p>
                            </div>
                        </div>

                        <div className="info-sections">
                            <div className="info-group">
                                <h3>Personal Details</h3>
                                <div className="info-grid-v2">
                                    <div className="info-field">
                                        <label><FiUser /> Full Name</label>
                                        <p>{user?.name}</p>
                                    </div>
                                    <div className="info-field">
                                        <label><FiMail /> Email Address</label>
                                        <p>{user?.email}</p>
                                    </div>
                                    <div className="info-field">
                                        <label><FiSmartphone /> Phone</label>
                                        <p>{user?.mobile || 'Not provided'}</p>
                                    </div>
                                    <div className="info-field">
                                        <label><FiActivity /> Role</label>
                                        <p style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-group">
                                <h3>Institutional Info</h3>
                                <div className="info-grid-v2">
                                    <div className="info-field full-width">
                                        <label><FiHome /> College</label>
                                        <p>{user?.collegeId?.name || user?.collegeName || 'Not Linked'}</p>
                                    </div>
                                    {user?.role === 'student' && (
                                        <>
                                            <div className="info-field">
                                                <label><FiBook /> Student ID</label>
                                                <p>{user?.studentId || 'N/A'}</p>
                                            </div>
                                            <div className="info-field">
                                                <label><FiMapPin /> Room Assignment</label>
                                                <p>{user?.roomNumber || 'A-102'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="secondary-section">
                    <div className="quick-actions-card">
                        <h3>Profile Actions</h3>
                        <div className="action-links">
                            <button className="reset-btn" onClick={() => {/* Handle password reset */ }}>Reset Password</button>
                            <button className="logout-btn-v2" onClick={handleLogout}>Sign Out Account</button>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>System Data</h3>
                        <div className="timing-item">
                            <span>Joined On</span>
                            <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong>
                        </div>
                        <div className="timing-item">
                            <span>Last Login</span>
                            <strong>Today</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
