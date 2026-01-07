import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUniversity, FaBuilding, FaUtensils, FaArrowRight } from 'react-icons/fa';
import './SelectPortal.scss';
import logoIcon from '../../../assets/images/logoIcon.png';

const PortalCard = ({ title, role, description, icon: Icon, color, onClick }) => (
    <div className="portal-card" onClick={onClick} role="button" tabIndex={0}>
        <div className="card-content">
            <div className="icon-wrapper" style={{ background: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
            <div className="text-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="arrow-icon" style={{ color: color }}>
                <FaArrowRight />
            </div>
        </div>
        <div className="card-border" style={{ background: color }}></div>
    </div>
);

const SelectPortal = () => {
    const navigate = useNavigate();

    const portals = [
        {
            title: 'Student Portal',
            role: 'student',
            description: 'Access your profile, mess menu, and lodge complaints.',
            icon: FaUserGraduate,
            color: '#3b82f6', // Bright Blue
        },
        {
            title: 'Super Admin',
            role: 'super-admin',
            description: 'Oversee college operations, analytics, and staff.',
            icon: FaUniversity,
            color: '#7c3aed', // Violet
        },
        {
            title: 'Hostel Admin',
            role: 'hostel-admin',
            description: 'Manage rooms, student allocation, and wardens.',
            icon: FaBuilding,
            color: '#f59e0b', // Amber
        },
        {
            title: 'Mess Admin',
            role: 'mess-admin',
            description: 'Update food menus, inventory, and feedback.',
            icon: FaUtensils,
            color: '#10b981', // Emerald
        }
    ];

    const handlePortalSelect = (role) => {
        navigate(`/login/${role}`);
    };

    return (
        <div className="select-portal-page">
            <div className="background-pattern"></div>

            <div className="content-container">
                <header className="page-header">
                    <div className="brand-logo">
                        <img src={logoIcon} alt="CampusPulse" />
                        <span>CampusPulse</span>
                    </div>
                    <h1>Select Your Portal</h1>
                    <p>Choose the dashboard relevant to your role to proceed.</p>
                </header>

                <div className="portals-grid">
                    {portals.map((portal) => (
                        <PortalCard
                            key={portal.role}
                            {...portal}
                            onClick={() => handlePortalSelect(portal.role)}
                        />
                    ))}
                </div>

                <footer className="page-footer">
                    <p>© 2024 CampusPulse. All rights reserved.</p>
                    <div className="links">
                        <a href="#">Privacy Policy</a>
                        <span>•</span>
                        <a href="#">Support</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SelectPortal;
