import React, { useState } from 'react';
import RaiseComplaint from '../../components/Complaints/RaiseComplaint';
import ComplaintList from '../../components/Complaints/ComplaintList';
import '../../assets/styles/DashboardCommons.scss';

const StudentComplaints = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>My Complaints & Requests 📝</h1>
                    <p>Report issues and track their resolution status in real-time.</p>
                </div>
            </div>

            <div className="dashboard-main-grid">
                <div className="primary-section">
                    <ComplaintList refreshTrigger={refreshTrigger} />
                </div>
                <div className="secondary-section">
                    <RaiseComplaint onSuccess={handleSuccess} />
                </div>
            </div>
        </div>
    );
};

export default StudentComplaints;
