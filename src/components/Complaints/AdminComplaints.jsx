import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiExternalLink, FiCheck, FiXCircle } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-hot-toast';
import './complaints.scss';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [remark, setRemark] = useState('');

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/complaints/admin');
            setComplaints(response.data);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        if (!remark && newStatus === 'Solved') {
            toast.error('Please provide a remark');
            return;
        }

        try {
            await api.put(`/complaints/${id}/status`, { status: newStatus, remark });
            toast.success(`Complaint marked as ${newStatus}`);
            setSelectedComplaint(null);
            setRemark('');
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    if (isLoading) return <div className="loader">Fetching records...</div>;

    return (
        <div className="admin-complaints-container">
            <div className="admin-header">
                <h2>Complaint Management</h2>
                <button onClick={fetchComplaints} className="refresh-btn"><FiRefreshCw /> Refresh</button>
            </div>

            <div className="complaints-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length > 0 ? complaints.map(c => (
                            <tr key={c._id}>
                                <td>
                                    {c.isAnonymous ? (
                                        <span className="anon-badge">Anonymous</span>
                                    ) : (
                                        <span className="user-name">{c.studentId?.name || 'Unknown'}</span>
                                    )}
                                </td>
                                <td>{c.category}</td>
                                <td className="truncate-text">{c.title}</td>
                                <td>
                                    <span className={`severity-tag ${c.severity?.toLowerCase()}`}>
                                        {c.severity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-tag ${c.status?.toLowerCase().replace(' ', '-')}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSelectedComplaint(c)}
                                        className="view-btn"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="no-data">No complaints pending action.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manage Modal */}
            {selectedComplaint && (
                <div className="complaint-modal-overlay">
                    <div className="complaint-modal">
                        <div className="modal-header">
                            <h3>Manage Complaint</h3>
                            <button onClick={() => setSelectedComplaint(null)}><FiXCircle /></button>
                        </div>
                        <div className="modal-body">
                            <div className="complaint-details">
                                <label>Title</label>
                                <p>{selectedComplaint.title}</p>
                                <label>Description</label>
                                <p>{selectedComplaint.description}</p>
                                <label>History</label>
                                <div className="history-timeline">
                                    {selectedComplaint.history?.map((h, i) => (
                                        <div key={i} className="history-item">
                                            <span>{new Date(h.updatedAt).toLocaleDateString()}</span>
                                            <strong>{h.status}</strong>: {h.remark}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="action-form">
                                <label>Admin Remark</label>
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder="Enter resolution notes or reason for status change..."
                                ></textarea>
                                <div className="modal-actions">
                                    <button
                                        className="btn-progress"
                                        onClick={() => handleUpdateStatus(selectedComplaint._id, 'In Progress')}
                                    >
                                        Start Progress
                                    </button>
                                    <button
                                        className="btn-solve"
                                        onClick={() => handleUpdateStatus(selectedComplaint._id, 'Solved')}
                                    >
                                        Mark Solved
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
