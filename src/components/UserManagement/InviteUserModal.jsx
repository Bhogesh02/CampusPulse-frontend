import React, { useState } from 'react';
import { FiMail, FiX, FiSend, FiInfo, FiShield } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-toastify';
import './inviteUserModal.scss';

/**
 * InviteUserModal
 * Reusable modal for Super Admin to invite different roles.
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {string} role - The role to invite (STUDENT, HOSTEL_ADMIN, MESS_ADMIN)
 * @param {string} collegeName - Auto-filled college name from Super Admin context
 */
const InviteUserModal = ({ isOpen, onClose, role, collegeName }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // Formatting role display
    const formatRole = (r) => r?.replace('_', ' ').toUpperCase();

    const handleInvite = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        setIsLoading(true);
        try {
            // Call backend API for invitation creation
            await api.post('/invites/create', {
                email,
                role,
                collegeName
            });

            toast.success(`Invitation sent successfully to ${email}`);
            setEmail('');
            onClose(true); // Signal refresh
        } catch (error) {
            console.error('Invite error:', error);
            const message = error.response?.data?.message || 'Failed to send invitation. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="invite-modal-overlay" onClick={onClose}>
            <div className="invite-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Invite Member</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleInvite}>
                    <div className="modal-body">
                        <div className="role-badge">
                            <FiShield />
                            <span>Target Role: {formatRole(role)}</span>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <FiMail />
                                <input
                                    type="email"
                                    placeholder="Enter collaborator's email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>College / Institution</label>
                            <div className="input-wrapper">
                                <FiInfo />
                                <input
                                    type="text"
                                    value={collegeName}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <p className="info-text">
                                * This member will be automatically linked to your registered institution.
                            </p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <FiSend /> Send Invitation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteUserModal;
