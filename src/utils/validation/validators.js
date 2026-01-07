/**
 * Validation Utility Functions
 */

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(String(email).toLowerCase())) return "Invalid email address";
    return null;
};

export const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    const re = /^[0-9]{10}$/;
    if (!re.test(mobile)) return "Mobile number must be exactly 10 digits";
    return null;
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
};

export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return `${fieldName || 'Field'} is required`;
    }
    return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};
