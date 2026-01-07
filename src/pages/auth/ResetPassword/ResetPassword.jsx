import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword, logoutUser } from '../../../store/auth/authActions';
import AuthLayout from '../../../components/layout/AuthLayout';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import CustomToast from '../../../components/CustomToast/CustomToast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match', type: 'error' });
            return;
        }

        if (password.length < 6) {
            setToast({ show: true, message: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await dispatch(resetPassword({ token, password })).unwrap();

            setToast({ show: true, message: 'Password reset successful! Redirecting to login...', type: 'success' });

            // Force logout so user has to login with new password (as requested)
            setTimeout(() => {
                dispatch(logoutUser());
                navigate('/select-portal');
            }, 2000);

        } catch (err) {
            setToast({ show: true, message: err || 'Password reset failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Set New Password"
            subtitle="Please create a new password for your account."
        >
            {toast.show && (
                <CustomToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                        <FiLock className="field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input-with-icon"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
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

                <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <FiLock className="field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input-with-icon"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? 'Reseting...' : 'Reset Password'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
