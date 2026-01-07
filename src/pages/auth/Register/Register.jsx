import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    registerStudent, registerSuperAdmin, registerHostelAdmin, registerMessAdmin
} from '../../../store/auth/authActions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '../../../store/auth/authSelectors';
import { clearState } from '../../../store/auth/authSlice';
import AuthLayout from '../../../components/layout/AuthLayout';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin, FiHash, FiGrid } from 'react-icons/fi';
import {
    validateEmail, validateMobile, validatePassword,
    validateRequired, validateConfirmPassword
} from '../../../utils/validation/validators';

// Enhanced InputField with Validation Support
const InputField = ({ label, name, type = "text", icon: Icon, placeholder, value, onChange, error }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className={`input-wrapper ${error ? 'has-error' : ''}`}>

            {/* Special handling for Mobile Number to show +91 prefix visually */}
            {name === 'mobile' ? (
                <>
                    <FiPhone className="field-icon" style={{ zIndex: 5 }} />
                    <span className="prefix-span" style={{
                        position: 'absolute',
                        left: '48px', // Starts exactly where icon padding ends
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#111827', // Darker color to match user input
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
                        style={{ paddingLeft: '82px' }} // Verified spacing for +91
                        placeholder="9876543210"
                        maxLength={10}
                        required
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

    // Local errors state
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '', mobile: '', firstName: '', lastName: '',
        studentId: '', collegeName: '', universityName: '', location: '', staffId: ''
    });

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
        return () => { dispatch(clearState()); };
    }, [isAuthenticated, user, navigate, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // Validations for Mobile: Only numbers, max 10 chars
        if (name === 'mobile') {
            newValue = value.replace(/\D/g, '').slice(0, 10);
        }

        setFormData({ ...formData, [name]: newValue });

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};

        // Common Validations (Email, Mobile, Password apply to everyone)
        errors.email = validateEmail(formData.email);
        errors.mobile = validateMobile(formData.mobile);
        errors.password = validatePassword(formData.password);
        errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

        // Role Specific Validations
        if (role === 'super-admin') {
            errors.collegeName = validateRequired(formData.collegeName, 'College Name');
            errors.universityName = validateRequired(formData.universityName, 'University Name');
            errors.location = validateRequired(formData.location, 'Location');
        } else {
            // All other roles (student, hostel-admin, mess-admin) require Name
            errors.firstName = validateRequired(formData.firstName, 'First Name');
            errors.lastName = validateRequired(formData.lastName, 'Last Name');

            if (role === 'student') {
                errors.studentId = validateRequired(formData.studentId, 'Student ID');
                errors.collegeName = validateRequired(formData.collegeName, 'College Name');
            } else {
                // Staff (Hostel/Mess Admin)
                errors.staffId = validateRequired(formData.staffId, 'Staff ID');
            }
        }

        // Clean up nulls
        Object.keys(errors).forEach(key => {
            if (errors[key] === null) delete errors[key];
        });

        return errors;
    };

    const getPayload = () => {
        const baseData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            role: role // Sending role as requested
        };

        if (role === 'student') {
            return {
                ...baseData,
                studentId: formData.studentId,
                collegeName: formData.collegeName
            };
        } else if (role === 'super-admin') {
            return {
                // Super Admin specific mapping
                collegeName: formData.collegeName,
                universityName: formData.universityName,
                email: formData.email,
                mobile: formData.mobile,
                location: formData.location,
                password: formData.password,
                role: 'super_admin' // Explicit backend role name
            };
        } else if (role === 'hostel-admin') {
            return {
                ...baseData,
                staffId: formData.staffId,
                role: 'hostel_admin'
            };
        } else if (role === 'mess-admin') {
            return {
                ...baseData,
                staffId: formData.staffId,
                role: 'mess_admin'
            };
        }
        return {};
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const data = getPayload();

        if (role === 'student') dispatch(registerStudent(data));
        else if (role === 'super-admin') dispatch(registerSuperAdmin(data));
        else if (role === 'hostel-admin') dispatch(registerHostelAdmin(data));
        else if (role === 'mess-admin') dispatch(registerMessAdmin(data));
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
            </>
        );
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle={`Join CampusPulse as a ${role?.replace('-', ' ')}`}
        >
            {(reduxError || (Object.keys(formErrors).length > 0 && !formErrors.mobile)) && (
                <div className="error-message">
                    {reduxError || "Please correct the errors below."}
                </div>
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
