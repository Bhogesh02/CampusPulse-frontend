import React from 'react';
import AdminComplaints from '../../components/Complaints/AdminComplaints';
import '../../assets/styles/DashboardCommons.scss';

const MessComplaints = () => {
    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Mess Complaint Inbox 📨</h1>
                    <p>Address concerns regarding food quality, hygiene, and service.</p>
                </div>
            </div>

            <div className="content-view-full">
                <AdminComplaints />
            </div>
        </div>
    );
};

export default MessComplaints;
