import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiInfo } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import './complaints.scss';

const StatusBadge = ({ status }) => (
    <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>
        {status}
    </span>
);

const ComplaintItem = ({ complaint }) => (
    <div className="complaint-item-card">
        <div className="item-main">
            <span className="item-category">{complaint.category} • {complaint.type}</span>
            <h5>{complaint.title}</h5>
            <p>{complaint.description}</p>
            <div className="item-meta">
                <span><FiCalendar /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                {complaint.isAnonymous && <span className="anonymous-label"><FiInfo /> Anonymous</span>}
            </div>
        </div>
        <div className="item-status-section">
            <StatusBadge status={complaint.status} />
            <div className={`severity-indicator ${complaint.severity?.toLowerCase()}`}>
                {complaint.severity === 'Critical' && '⚠️ Critical'}
            </div>
        </div>
    </div>
);

const ComplaintList = ({ refreshTrigger }) => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await api.get('/complaints/student');
                setComplaints(response.data);
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaints();
    }, [refreshTrigger]);

    if (isLoading) return <div className="loader">Loading complaints...</div>;

    return (
        <div className="complaint-list-container">
            <div className="list-header">
                <h4>Your Complaints History</h4>
                <span>{complaints.length} Total</span>
            </div>

            <div className="complaints-grid">
                {complaints.length > 0 ? (
                    complaints.map(complaint => (
                        <ComplaintItem key={complaint._id} complaint={complaint} />
                    ))
                ) : (
                    <div className="empty-state">No complaints raised yet.</div>
                )}
            </div>
        </div>
    );
};

export default ComplaintList;
