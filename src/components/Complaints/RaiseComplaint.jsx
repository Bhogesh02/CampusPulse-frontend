import React, { useState } from 'react';
import { FiAlertCircle, FiSend, FiImage, FiSettings } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-hot-toast';
import './complaints.scss';

const RaiseComplaint = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Maintenance',
        type: 'Hostel',
        isAnonymous: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/complaints', formData);
            toast.success('Complaint raised successfully!');
            setFormData({
                title: '',
                description: '',
                category: 'Maintenance',
                type: 'Hostel',
                isAnonymous: false
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to raise complaint');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="raise-complaint-card">
            <div className="card-header">
                <h3><FiAlertCircle /> Raise a New Complaint</h3>
                <p>Provide details about the issue you're facing.</p>
            </div>

            <form onSubmit={handleSubmit} className="complaint-form">
                <div className="form-group">
                    <label>Complaint Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Water leakage in Room 302"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Maintenance">Maintenance</option>
                            <option value="Food Quality">Food Quality</option>
                            <option value="Hygiene">Hygiene</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Wifi/Internet">Wifi/Internet</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Hostel">Hostel (Accommodation)</option>
                            <option value="Mess">Mess (Food & Dining)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows="4"
                        placeholder="Describe the issue in detail..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div className="form-footer">
                    <label className="anonymous-toggle">
                        <input
                            type="checkbox"
                            checked={formData.isAnonymous}
                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        />
                        <span>Raise Anonymously</span>
                    </label>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Processing...' : <><FiSend /> Submit Complaint</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RaiseComplaint;
