import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { selectUser } from '../../store/auth/authSelectors';
import { logoutUser } from '../../store/auth/authActions';
import './navbar.scss';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Format Role for Display (e.g., 'super_admin' -> 'SUPER ADMIN')
    const displayRole = user?.role ? user.role.replace('_', ' ').toUpperCase() : 'USER';
    const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name : 'User';

    // Handle Click Outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/select-portal');
    };

    return (
        <header className="navbar">
            <div className="navbar-right">
                <div className="user-info">
                    <span className="user-name">{displayName}</span>
                    <span className="user-role">{displayRole}</span>
                </div>

                <div className="profile-dropdown" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="profile-avatar">
                        <FiUser />
                    </div>

                    <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                        <button className="dropdown-item">
                            <FiUser /> My Profile
                        </button>
                        <button className="dropdown-item">
                            <FiSettings /> Settings
                        </button>
                        <div className="divider"></div>
                        <button className="dropdown-item danger" onClick={handleLogout}>
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
