import React from 'react';
import './AuthLayout.scss';
import logoIcon from '../../assets/images/logoIcon.png';
// Using placeholders for partner logos to match the reference Vibe
import { FaDiscord, FaSlack, FaDropbox, FaSquare, FaIntercom } from 'react-icons/fa';

/**
 * AuthLayout
 * Refined Professional Design "CampusPulse"
 * Split screen: Left (Form), Right (Branding & Testimonials)
 */
const brandingData = {
    'student': {
        title: "Your Campus Life, Simplified.",
        quote: "CampusPulse makes it so easy to check mess menus and raise complaints. I feel much more connected to the campus administration.",
        author: "Priya Sharma",
        role: "Final Year Student",
        stats: "Students"
    },
    'super-admin': {
        title: "Empower Your Institution with Data.",
        quote: "Real-time analytics and centralized control over all hostel branches have improved our administrative efficiency by 40%.",
        author: "Dr. R.K. Gupta",
        role: "Dean of Administration",
        stats: "Administrators"
    },
    'hostel-admin': {
        title: "Efficient Hostel Operations.",
        quote: "Tracking room allocation, student attendance, and maintenance requests has never been smoother. A true lifesaver for wardens.",
        author: "Suresh Patil",
        role: "Senior Warden",
        stats: "Wardens"
    },
    'mess-admin': {
        title: "Streamlining Food Management.",
        quote: "Inventory tracking and daily student feedback help us maintain high food quality and significantly reduce waste.",
        author: "Chef Anjali",
        role: "Head of Mess",
        stats: "Mess Staff"
    },
    'default': {
        title: "Revolutionize Campus Life with Smarter Management.",
        quote: "CampusPulse has completely transformed our hostel management. It’s reliable, efficient, and ensures our students feel safe and connected.",
        author: "Rajesh Kumar",
        role: "Dean of Student Affairs",
        stats: "Users"
    }
};

const AuthLayout = ({ children, title, subtitle, role }) => {
    // Normalize role if it comes with different casing, though usually lowercase from URL
    const activeBranding = brandingData[role] || brandingData['default'];

    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div className="auth-header">
                    <div className="brand-logo">
                        <img src={logoIcon} alt="CampusPulse" />
                        <span>CampusPulse</span>
                    </div>
                </div>

                <div className="auth-body">
                    <h1>{title}</h1>
                    {subtitle && <p className="subtitle">{subtitle}</p>}
                    {children}
                </div>

                <div className="auth-footer-links">
                    <span>© 2024 CampusPulse</span>
                    <div className="links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="content-overlay">
                    <h2>{activeBranding.title}</h2>

                    <div className="quote-card">
                        <div className="quote-icon">“</div>
                        <p>"{activeBranding.quote}"</p>
                        <div className="author">
                            <div className="avatar-circle">
                                {activeBranding.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="info">
                                <strong>{activeBranding.author}</strong>
                                <span>{activeBranding.role}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
