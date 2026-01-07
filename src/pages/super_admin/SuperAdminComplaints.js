import React from 'react';
import AdminComplaints from '../../components/Complaints/AdminComplaints';
import '../../assets/styles/DashboardCommons.scss';

const SuperAdminComplaints = () => {
    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Global Complaint Center 🏢</h1>
                    <p>Overview of all hostel and mess complaints across the institution.</p>
                </div>
            </div>

            <div className="content-view-full">
                <AdminComplaints />
            </div>
        </div>
    );
};

export default SuperAdminComplaints;
