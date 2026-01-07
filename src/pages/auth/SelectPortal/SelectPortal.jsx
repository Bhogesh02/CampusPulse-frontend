import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectPortal.scss';

// We can import icons if available, for now using emojis or divs
const PortalCard = ({ title, role, description, color, onClick }) => (
    <div className="portal-card" onClick={onClick} style={{ borderColor: color }}>
        <div className="icon-circle" style={{ backgroundColor: color }}>
            {/* Placeholder icon */}
            <span role="img" aria-label={title}>👤</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="enter-btn" style={{ color: color }}>Enter Portal →</button>
    </div>
);

const SelectPortal = () => {
    const navigate = useNavigate();

    const portals = [
        {
            title: 'Student',
            role: 'student',
            description: 'Log complaints, view mess menu, and manage your profile.',
            color: '#3b82f6', // Blue
        },
        {
            title: 'College Admin',
            role: 'super-admin',
            description: 'Manage entire system, analytics, and university compliance.',
            color: '#8b5cf6', // Purple
        },
        {
            title: 'Hostel Admin',
            role: 'hostel-admin',
            description: 'Manage rooms, wardens, and daily hostel operations.',
            color: '#f59e0b', // Amber
        },
        {
            title: 'Mess Admin',
            role: 'mess-admin',
            description: 'Update menus, track food inventory, and ratings.',
            color: '#10b981', // Emerald
        }
    ];

    const handlePortalSelect = (role) => {
        navigate(`/login/${role}`);
    };

    return (
        <div className="portal-container">
            <div className="portal-header">
                <h1>Welcome to Hostel Management</h1>
                <p>Please select your role to continue</p>
            </div>

            <div className="portal-grid">
                {portals.map((portal) => (
                    <PortalCard
                        key={portal.role}
                        {...portal}
                        onClick={() => handlePortalSelect(portal.role)}
                    />
                ))}
            </div>

            <div className="footer-links">
                <a href="#">Need Help?</a>
                <span className="separator">•</span>
                <a href="#">Privacy Policy</a>
            </div>
        </div>
    );
};

export default SelectPortal;
