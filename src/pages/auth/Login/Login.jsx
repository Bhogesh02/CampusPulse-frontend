import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../../store/auth/authActions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '../../../store/auth/authSelectors';
import { clearState } from '../../../store/auth/authSlice';
import AuthLayout from '../../../components/layout/AuthLayout';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const { role } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    React.useEffect(() => {
        if (isAuthenticated && user) {
            const userRole = user.role;
            switch (userRole) {
                case 'student': navigate('/student/dashboard'); break;
                case 'super_admin': navigate('/super-admin/dashboard'); break;
                case 'hostel_admin': navigate('/hostel-admin/dashboard'); break;
                case 'mess_admin': navigate('/mess-admin/dashboard'); break;
                default: navigate('/');
            }
        }
        return () => { dispatch(clearState()); }
    }, [isAuthenticated, user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Login with email, password AND role to ensure correct portal access
        dispatch(loginUser({ email, password, role }));
    };

    const getPortalTitle = () => {
        switch (role) {
            case 'super-admin': return 'Super Admin (College)';
            case 'mess-admin': return 'Mess Admin';
            case 'hostel-admin': return 'Hostel Admin';
            case 'student': return 'Student';
            default: return 'Login';
        }
    };

    return (
        <AuthLayout
            title="Welcome Back!"
            subtitle={`Sign in to access your ${getPortalTitle()} dashboard.`}
        >
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                        <FiMail className="field-icon" />
                        <input
                            type="email"
                            className="input-with-icon"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <FiLock className="field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input-with-icon"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="eye-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                <div className="form-actions" style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                    <Link to="/forgot-password" style={{ color: '#0f4c3a', fontWeight: '500', fontSize: '0.9rem' }}>Forgot Password?</Link>
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#6b7280' }}>
                    Don't have an account? <Link to={`/register/${role}`} style={{ color: '#0f4c3a', fontWeight: 600 }}>Sign Up</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
