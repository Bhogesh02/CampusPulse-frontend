import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    registerStudent, registerSuperAdmin, registerHostelAdmin, registerMessAdmin, logoutUser
} from '../../../store/auth/authActions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '../../../store/auth/authSelectors';
import { clearState } from '../../../store/auth/authSlice';
import AuthLayout from '../../../components/layout/AuthLayout';
import CustomToast from '../../../components/CustomToast/CustomToast';

import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin, FiHash, FiGrid } from 'react-icons/fi';
import {
    validateEmail, validateMobile, validatePassword,
    validateRequired, validateConfirmPassword
} from '../../../utils/validation/validators';
import api from '../../../store/api/axiosBase';
import { useSearchParams } from 'react-router-dom';

// Enhanced InputField with Validation Support and Prop support
const InputField = ({ label, name, type = "text", icon: Icon, placeholder, value, onChange, error, ...props }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
            {name === 'mobile' ? (
                <>
                    <FiPhone className="field-icon" style={{ zIndex: 5 }} />
                    <span className="prefix-span" style={{
                        position: 'absolute',
                        left: '48px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#111827',
                        fontWeight: '500',
                        fontSize: '0.95rem',
                        zIndex: 3,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
                    }}>+91</span>
                    <input
                        name={name}
                        type="tel"
                        value={value || ''}
                        onChange={onChange}
                        className="input-with-icon input-mobile"
                        style={{ paddingLeft: '82px' }}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        disabled={props.disabled}
                    />
                </>
            ) : (
                <>
                    {Icon && <Icon className="field-icon" />}
                    <input
                        name={name}
                        type={type}
                        value={value || ''}
                        onChange={onChange}
                        className={Icon ? "input-with-icon" : ""}
                        placeholder={placeholder}
                        required
                        disabled={props.disabled}
                    />
                </>
            )}
        </div>
        {error && <span className="field-error-text" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
);

const Register = () => {
    const { role } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(selectAuthLoading);
    const reduxError = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [toastState, setToastState] = useState({ show: false, message: '', type: 'success', title: '' });
    const isJustRegistered = React.useRef(false);

    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '', mobile: '', firstName: '', lastName: '',
        studentId: '', collegeName: '', universityName: '', location: '', staffId: ''
    });

    const [searchParams] = useSearchParams();
    const [isInvited, setIsInvited] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Token verification on mount
    React.useEffect(() => {
        const token = searchParams.get('token');
        if (token && role !== 'super-admin') { // Super Admin doesn't need invite (self-registered)
            verifyToken(token);
        }
    }, [searchParams, role]);

    const verifyToken = async (token) => {
        setIsVerifying(true);
        try {
            const response = await api.get(`/invites/verify?token=${token}`);
            const { email, collegeName } = response.data;
            setFormData(prev => ({
                ...prev,
                email,
                collegeName
            }));
            setIsInvited(true);
            setToastState({
                show: true,
                message: "Invitation verified! Please complete your details.",
                type: 'success'
            });
        } catch (error) {
            setToastState({
                show: true,
                message: error.response?.data?.message || "Invalid or expired invitation token.",
                type: 'error',
                title: "Verification Failed"
            });
        } finally {
            setIsVerifying(false);
        }
    };

    // Effect to show Redux errors in Toast
    React.useEffect(() => {
        if (reduxError) {
            setToastState({
                show: true,
                message: reduxError,
                type: 'error',
                title: 'Registration Failed'
            });
            dispatch(clearState()); // Clear it from store so it doesn't persist forever
        }
    }, [reduxError, dispatch]);

    // ... handleChange ...
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'mobile') {
            newValue = value.replace(/\D/g, '').slice(0, 10);
        }
        setFormData({ ...formData, [name]: newValue });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    // ... validateForm ... (Keep existing validation logic)
    const validateForm = () => {
        const errors = {};
        errors.email = validateEmail(formData.email);
        errors.mobile = validateMobile(formData.mobile);
        errors.password = validatePassword(formData.password);
        errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

        if (role === 'super-admin') {
            errors.collegeName = validateRequired(formData.collegeName, 'College Name');
            errors.universityName = validateRequired(formData.universityName, 'University Name');
            errors.location = validateRequired(formData.location, 'Location');
        } else {
            errors.firstName = validateRequired(formData.firstName, 'First Name');
            errors.lastName = validateRequired(formData.lastName, 'Last Name');
            if (role === 'student') {
                errors.studentId = validateRequired(formData.studentId, 'Student ID');
                errors.collegeName = validateRequired(formData.collegeName, 'College Name');
            } else {
                errors.staffId = validateRequired(formData.staffId, 'Staff ID');
                errors.collegeName = validateRequired(formData.collegeName, 'College Name');
            }
        }
        Object.keys(errors).forEach(key => {
            if (errors[key] === null) delete errors[key];
        });
        return errors;
    };

    // ... getPayload ... (Keep existing payload logic)
    const getPayload = () => {
        const baseData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            role: role
        };
        if (role === 'student') {
            return { ...baseData, studentId: formData.studentId, collegeName: formData.collegeName, token: searchParams.get('token') };
        } else if (role === 'super-admin') {
            return {
                collegeName: formData.collegeName, universityName: formData.universityName,
                email: formData.email, mobile: formData.mobile, location: formData.location,
                password: formData.password, role: 'super_admin'
            };
        } else if (role === 'hostel-admin') {
            return { ...baseData, staffId: formData.staffId, collegeName: formData.collegeName, role: 'hostel_admin', token: searchParams.get('token') };
        } else if (role === 'mess-admin') {
            return { ...baseData, staffId: formData.staffId, collegeName: formData.collegeName, role: 'mess_admin', token: searchParams.get('token') };
        }
        return {};
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Optional: Show toast for form validation errors too if desired
            setToastState({
                show: true,
                message: "Please correct the highlighted errors.",
                type: 'error',
                title: 'Validation Error'
            });
            return;
        }

        const data = getPayload();
        isJustRegistered.current = true;

        let action;
        if (role === 'student') action = registerStudent(data);
        else if (role === 'super-admin') action = registerSuperAdmin(data);
        else if (role === 'hostel-admin') action = registerHostelAdmin(data);
        else if (role === 'mess-admin') action = registerMessAdmin(data);

        if (action) {
            try {
                await dispatch(action).unwrap();
                setToastState({
                    show: true,
                    message: "Registration Successful! Redirecting...",
                    type: 'success',
                    title: 'Account Created'
                });
                setTimeout(() => {
                    dispatch(clearState());
                    dispatch(logoutUser()); // Force logout so login page doesn't auto-redirect to dashboard
                    navigate(`/login/${role}`);
                }, 2000);
            } catch (err) {
                // Error is handled by useEffect listening to reduxError, 
                // BUT thunk .unwrap() throws error, so we can also set it here immediately for faster feedback
                isJustRegistered.current = false;
                setToastState({
                    show: true,
                    message: err.message || "Registration failed. Please try again.",
                    type: 'error',
                    title: 'Registration Failed'
                });
            }
        }
    };

    const renderFields = () => {
        const commonFields = (
            <>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <InputField
                            label="First Name" name="firstName" placeholder="First Name" icon={FiUser}
                            value={formData.firstName} onChange={handleChange} error={formErrors.firstName}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <InputField
                            label="Last Name" name="lastName" placeholder="Last Name" icon={FiUser}
                            value={formData.lastName} onChange={handleChange} error={formErrors.lastName}
                        />
                    </div>
                </div>
                <InputField
                    label="Email" name="email" type="email" placeholder="john@example.com" icon={FiMail}
                    value={formData.email} onChange={handleChange} error={formErrors.email}
                    disabled={isInvited}
                />
                <InputField
                    label="Mobile Number" name="mobile" placeholder="XXXXXXXXXX" icon={FiPhone}
                    value={formData.mobile} onChange={handleChange} error={formErrors.mobile}
                />
            </>
        );

        if (role === 'super-admin') {
            return (
                <>
                    <InputField
                        label="College Name" name="collegeName" placeholder="College Name" icon={FiGrid}
                        value={formData.collegeName} onChange={handleChange} error={formErrors.collegeName}
                    />
                    <InputField
                        label="University" name="universityName" placeholder="University Name" icon={FiGrid}
                        value={formData.universityName} onChange={handleChange} error={formErrors.universityName}
                    />
                    <InputField
                        label="Email" name="email" type="email" placeholder="admin@college.edu" icon={FiMail}
                        value={formData.email} onChange={handleChange} error={formErrors.email}
                    />
                    <InputField
                        label="Mobile Number" name="mobile" placeholder="XXXXXXXXXX" icon={FiPhone}
                        value={formData.mobile} onChange={handleChange} error={formErrors.mobile}
                    />
                    <InputField
                        label="Location" name="location" placeholder="City, State" icon={FiMapPin}
                        value={formData.location} onChange={handleChange} error={formErrors.location}
                    />
                </>
            );
        }
        if (role === 'student') {
            return (
                <>
                    {commonFields}
                    <InputField
                        label="Student ID" name="studentId" placeholder="Roll Number" icon={FiHash}
                        value={formData.studentId} onChange={handleChange} error={formErrors.studentId}
                    />
                    <InputField
                        label="College Name" name="collegeName" placeholder="Correct Registered College Name" icon={FiGrid}
                        value={formData.collegeName} onChange={handleChange} error={formErrors.collegeName}
                        disabled={isInvited}
                    />
                </>
            );
        }
        return (
            <>
                {commonFields}
                <InputField
                    label="Staff ID" name="staffId" placeholder="Staff/Employee ID" icon={FiHash}
                    value={formData.staffId} onChange={handleChange} error={formErrors.staffId}
                />
                <InputField
                    label="College Name" name="collegeName" placeholder="Registered College Name" icon={FiGrid}
                    value={formData.collegeName} onChange={handleChange} error={formErrors.collegeName}
                    disabled={isInvited}
                />
            </>
        );
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle={`Join CampusPulse as a ${role?.replace('-', ' ')}`}
            role={role}
        >
            {toastState.show && (
                <CustomToast
                    message={toastState.message}
                    type={toastState.type}
                    title={toastState.title}
                    onClose={() => setToastState({ ...toastState, show: false })}
                />
            )}

            <form onSubmit={handleSubmit} noValidate>
                {renderFields()}

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <FiLock className="field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-with-icon"
                            placeholder="Create a password"
                            required
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {formErrors.password && <span className="field-error-text" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{formErrors.password}</span>}
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <FiLock className="field-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-with-icon"
                            placeholder="Re-enter password"
                            required
                        />
                    </div>
                    {formErrors.confirmPassword && <span className="field-error-text" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{formErrors.confirmPassword}</span>}
                </div>

                <button type="submit" className="btn-register" disabled={loading}>
                    {loading ? 'Creating...' : 'Sign Up'}
                </button>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#6b7280' }}>
                    Already have an account? <Link to={`/login/${role}`} style={{ color: '#0f4c3a', fontWeight: 600 }}>Log In</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
