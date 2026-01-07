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
const AuthLayout = ({ children, title, subtitle }) => {
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
                    <h2>Revolutionize Campus Life with <br /> Smarter Management.</h2>

                    <div className="quote-card">
                        <div className="quote-icon">“</div>
                        <p>
                            "CampusPulse has completely transformed our hostel management.
                            It’s reliable, efficient, and ensures our students feel safe and connected."
                        </p>
                        <div className="author">
                            <div className="avatar-circle">RJ</div>
                            <div className="info">
                                <strong>Rajesh Kumar</strong>
                                <span>Dean of Student Affairs</span>
                            </div>
                        </div>
                    </div>

                    <div className="partner-logos">
                        <span>TRUSTED BY TOP INSTITUTIONS</span>
                        <div className="logos-grid">
                            <div className="logo-item"><FaDiscord /> <span>Discord</span></div>
                            <div className="logo-item"><FaSlack /> <span>Slack</span></div>
                            <div className="logo-item"><FaDropbox /> <span>Dropbox</span></div>
                            <div className="logo-item"><FaIntercom /> <span>Intercom</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
