import React from 'react';
import MessSchedule from '../../components/Schedule/MessSchedule';
import '../../assets/styles/DashboardCommons.scss';

const StudentMessMenu = () => {
    return (
        <div className="dashboard-v2">
            <div className="welcome-section-v2">
                <div className="welcome-text">
                    <h1>Weekly Mess Schedule 🥯</h1>
                    <p>Plan your meals for the week. Menu is updated every Sunday.</p>
                </div>
            </div>

            <div className="content-view-full">
                <MessSchedule />
            </div>
        </div>
    );
};

export default StudentMessMenu;
