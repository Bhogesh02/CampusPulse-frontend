/**
 * Anonymous Complaint Page - No Login Required
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AnonymousComplaint.css';

const AnonymousComplaint = () => {
  const [complaintType, setComplaintType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setComplaintType(type);
    setFormData({
      ...formData,
      category: type === 'mess' ? 'Mess' : 'Hostel'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { complaintsAPI } = await import('../../services/api');
      await complaintsAPI.createAnonymous(formData);
      
      toast.success('Anonymous complaint submitted successfully!');
      
      // Reset form
      setFormData({ title: '', description: '', category: '' });
      setComplaintType(null);
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (!complaintType) {
    return (
      <div className="anonymous-complaint-container">
        <div className="anonymous-header">
          <h1>🕵️ Anonymous Complaint</h1>
          <p>No login required - Your identity will remain private</p>
        </div>

        <div className="complaint-type-selection">
          <div
            className="complaint-type-card mess"
            onClick={() => handleTypeSelect('mess')}
          >
            <div className="type-icon">🍽️</div>
            <h3>Mess Complaint</h3>
            <p>Food quality, hygiene, timings</p>
            <div className="type-arrow">→</div>
          </div>

          <div
            className="complaint-type-card hostel"
            onClick={() => handleTypeSelect('hostel')}
          >
            <div className="type-icon">🏢</div>
            <h3>Hostel Complaint</h3>
            <p>Room, water, electricity, cleanliness</p>
            <div className="type-arrow">→</div>
          </div>
        </div>

        <div className="anonymous-warning">
          <p>⚠️ Note: Anonymous complaints cannot be tracked</p>
          <p>For status updates, please login as a Student</p>
        </div>

        <button className="back-to-login" onClick={() => navigate('/login')}>
          ← Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="anonymous-complaint-container">
      <div className="anonymous-form-card">
        <button className="back-button" onClick={() => setComplaintType(null)}>
          ← Back
        </button>

        <div className="form-header">
          <div className="form-icon">
            {complaintType === 'mess' ? '🍽️' : '🏢'}
          </div>
          <h2>{complaintType === 'mess' ? 'Mess' : 'Hostel'} Complaint</h2>
          <p>Submit your complaint anonymously</p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label>Complaint Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Brief description of the issue"
            />
          </div>

          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea
              className="form-control"
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Please provide detailed information about the complaint..."
            />
          </div>

          <div className="anonymous-notice">
            <p>🔒 Your complaint will be submitted anonymously</p>
            <p>❌ You will not receive status updates</p>
            <p>✅ Your identity will remain confidential</p>
          </div>

          <button
            type="submit"
            className="submit-complaint-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Anonymous Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnonymousComplaint;
