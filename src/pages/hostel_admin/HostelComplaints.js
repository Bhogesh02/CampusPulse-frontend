import React from 'react';
import AdminComplaints from '../../components/Complaints/AdminComplaints';
import '../../assets/styles/DashboardCommons.scss';

const HostelComplaints = () => {
    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Hostel Maintenance Inbox 🛠️</h1>
                    <p>Manage repair requests and facility maintenance tasks.</p>
                </div>
            </div>

            <div className="content-view-full">
                <AdminComplaints />
            </div>
        </div>
    );
};

export default HostelComplaints;
