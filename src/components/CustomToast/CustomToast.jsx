import React, { useEffect } from 'react';
import './CustomToast.scss';
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const CustomToast = ({ message, type = 'success', onClose, title }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <FiCheck />;
            case 'error': return <FiAlertCircle />;
            case 'info': return <FiInfo />;
            default: return <FiInfo />;
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (type) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'info': return 'Information';
            default: return 'Notification';
        }
    };

    return (
        <div className="custom-toast-overlay">
            <div className={`toast-card ${type}`}>
                <div className="icon-box">
                    {getIcon()}
                </div>
                <div className="toast-content">
                    <h4>{getTitle()}</h4>
                    <p>{message}</p>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <FiX />
                </button>
            </div>
        </div>
    );
};

export default CustomToast;
