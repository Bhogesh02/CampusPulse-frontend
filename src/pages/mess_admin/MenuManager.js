import React from 'react';
import UploadSchedule from '../../components/Schedule/UploadSchedule';
import '../../assets/styles/DashboardCommons.scss';

const MenuManager = () => {
    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Menu Designer 🥗</h1>
                    <p>Create and publish the weekly dining schedule for students.</p>
                </div>
            </div>

            <div className="content-view-full">
                <UploadSchedule />
            </div>
        </div>
    );
};

export default MenuManager;
