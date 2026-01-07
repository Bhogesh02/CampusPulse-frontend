import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle={!submitted ? "Enter your email address to receive password reset instructions." : ""}
        >
            {!submitted ? (
                <>
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
                                    required
                                    placeholder="your-email@example.com"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link to="/select-portal" style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            <FiArrowLeft /> Back to Login
                        </Link>
                    </div>
                </>
            ) : (
                <div className="success-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div className="icon-check" style={{
                        width: '60px', height: '60px', background: '#ecfdf5', color: '#059669',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem'
                    }}><FiCheck /></div>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Check your email</h3>

                    <p style={{ color: '#6b7280', margin: '1rem 0', lineHeight: 1.6 }}>
                        We have sent a password reset link to <br /><strong>{email}</strong>.
                    </p>

                    <Link to="/select-portal" className="btn-login" style={{
                        display: 'inline-block',
                        width: 'auto',
                        padding: '0.75rem 2rem',
                        marginTop: '1.5rem',
                        textDecoration: 'none',
                        lineHeight: '1.5'
                    }}>
                        Return to Login
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
