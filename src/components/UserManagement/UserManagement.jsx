import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { FiUsers, FiUserPlus, FiShield, FiUserCheck, FiSearch, FiRefreshCw, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import InviteUserModal from './InviteUserModal';
import api from '../../store/api/axiosBase';
import { toast } from 'react-toastify';
import './userManagement.scss';

/**
 * UserManagement Component
 * Main page for Super Admin to manage and invite staff/students.
 */
const UserManagement = () => {
    const currentUser = useSelector(selectUser);
    const [activeTab, setActiveTab] = useState('hostel_admin');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invites, setInvites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Tab Configuration
    const tabs = [
        { id: 'hostel_admin', label: 'Hostel Admins', icon: FiShield },
        { id: 'mess_admin', label: 'Mess Admins', icon: FiUsers },
        { id: 'student', label: 'Students', icon: FiUserCheck },
    ];

    const fetchInvites = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/invites?role=${activeTab}`);
            if (response.data.success) {
                setInvites(response.data.invites);
            }
        } catch (error) {
            console.error('Fetch invites error:', error);
            // Don't toast on initial load if user isn't fully auth'd yet, but usually handled by ProtectedRoute
            if (error.response?.status !== 401) {
                toast.error('Failed to load invitations');
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (currentUser) {
            fetchInvites();
        }
    }, [fetchInvites, currentUser]);

    // Get display name for current tab
    const currentTabLabel = tabs.find(t => t.id === activeTab)?.label;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="status-pill pending"><FiClock /> Pending</span>;
            case 'accepted':
                return <span className="status-pill active"><FiCheckCircle /> Success</span>;
            case 'expired':
                return <span className="status-pill expired"><FiAlertCircle /> Expired</span>;
            default:
                return <span className="status-pill">{status}</span>;
        }
    };

    return (
        <div className="dashboard-v2 user-management-page">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>User Management 👥</h1>
                    <p>Invite and manage staff members and students for {currentUser?.collegeName || 'your institution'}.</p>
                </div>
            </div>

            <nav className="management-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon />
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="tab-content-area">
                <div className="content-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2>{currentTabLabel}</h2>
                        <button
                            className={`refresh-btn ${isLoading ? 'loading' : ''}`}
                            onClick={fetchInvites}
                            disabled={isLoading}
                            title="Refresh List"
                        >
                            <FiRefreshCw />
                        </button>
                    </div>
                    <button
                        className="invite-trigger-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FiUserPlus /> Invite {activeTab.replace('_', ' ')}
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th>Invited Date</th>
                                <th>Status</th>
                                <th>Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="loading-row">
                                    <td colSpan="5">
                                        <div className="table-loader">
                                            <div className="spinner"></div>
                                            <p>Fetching {currentTabLabel.toLowerCase()}...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : invites.length > 0 ? (
                                invites.map((invite) => (
                                    <tr key={invite._id}>
                                        <td>
                                            <div className="email-cell">
                                                <strong>{invite.email}</strong>
                                            </div>
                                        </td>
                                        <td>{invite.role.replace('_', ' ').toUpperCase()}</td>
                                        <td>{new Date(invite.createdAt).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</td>
                                        <td>{getStatusBadge(invite.status)}</td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(invite.expiresAt) < new Date() && invite.status === 'pending' ? 'Expired' :
                                                    new Date(invite.expiresAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="empty-state-row">
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <FiSearch />
                                            <p>No {currentTabLabel.toLowerCase()} found.</p>
                                            <button
                                                className="btn-primary"
                                                onClick={() => setIsModalOpen(true)}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', marginTop: '1rem' }}
                                            >
                                                Send First Invitation
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Invitation Modal */}
            <InviteUserModal
                isOpen={isModalOpen}
                onClose={(shouldRefresh) => {
                    setIsModalOpen(false);
                    if (shouldRefresh === true) {
                        fetchInvites();
                    }
                }}
                role={activeTab}
                collegeName={currentUser?.collegeName || currentUser?.name?.split(' Admin')[0] || 'Institution'}
            />
        </div>
    );
};

export default UserManagement;
