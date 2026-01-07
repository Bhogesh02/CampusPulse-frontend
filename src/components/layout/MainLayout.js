import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../store/auth/authSelectors';
import { logoutUser } from '../../store/auth/authActions';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/images/logoIcon.png';

import FloatingChatbot from '../chatbot/FloatingChatbot';

// Assuming styles are moved, or we import from root for now if not moved yet
// import '../../assets/styles/App.css'; 

const MainLayout = ({ children }) => {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/select-portal');
    };

    return (
        <div className="app-container">
            {isAuthenticated && (
                <header style={{
                    backgroundColor: '#fff',
                    padding: '1rem 2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={logoIcon} alt="Logo" style={{ width: '30px', height: '30px' }} />
                            <h2 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>CampusPulse</h2>
                        </div>
                        {user && <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize', marginLeft: '40px' }}>{user.role?.replace('_', ' ')} Dashboard</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 500 }}>{user?.firstName} {user?.lastName}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </header>
            )}

            <main className="main-content">
                {children}
            </main>

            {isAuthenticated && <FloatingChatbot />}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default MainLayout;
