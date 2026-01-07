/**
 * Anonymous Complaint Page
 * No login required - submits complaints anonymously
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { toast } from 'react-toastify';
import './AnonymousComplaint.css';

const AnonymousComplaint = () => {
  const [complaintType, setComplaintType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'normal'
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
      // Submit as anonymous complaint
      await complaintsAPI.create({
        ...formData,
        anonymous: true,
        studentId: null
      });

      toast.success('Complaint submitted anonymously!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!complaintType) {
    return (
      <div className="anonymous-complaint-container">
        <div className="anonymous-header">
          <h1>🕵️ Anonymous Complaint</h1>
          <p>Submit a complaint without logging in</p>
          <div className="warning-box">
            <strong>⚠️ Note:</strong> Anonymous complaints cannot be tracked. You will not receive updates or email notifications.
          </div>
        </div>

        <div className="complaint-type-selection">
          <div 
            className="type-card mess-card"
            onClick={() => handleTypeSelect('mess')}
          >
            <div className="type-icon">🍽️</div>
            <h3>Mess Complaint</h3>
            <p>Food quality, hygiene, timings, menu issues</p>
          </div>

          <div 
            className="type-card hostel-card"
            onClick={() => handleTypeSelect('hostel')}
          >
            <div className="type-icon">🏢</div>
            <h3>Hostel Complaint</h3>
            <p>Room, water, electricity, cleanliness issues</p>
          </div>
        </div>

        <div className="back-to-login">
          <button onClick={() => navigate('/login')} className="btn-secondary">
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anonymous-complaint-container">
      <div className="anonymous-header">
        <button className="back-button" onClick={() => setComplaintType(null)}>
          ← Back
        </button>
        <h1>
          {complaintType === 'mess' ? '🍽️ Mess Complaint' : '🏢 Hostel Complaint'}
        </h1>
        <p>Your identity will remain anonymous</p>
      </div>

      <div className="complaint-form-container">
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label>Complaint Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title of your complaint"
            />
          </div>

          <div className="form-group">
            <label>Severity *</label>
            <select
              name="severity"
              className="form-control"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              <option value="normal">Normal</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your complaint in detail..."
            />
          </div>

          <div className="anonymous-notice">
            <p>🔒 Your complaint will be submitted anonymously. Admins cannot see your identity.</p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Anonymous Complaint'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-secondary btn-block"
          >
            Login to Track Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnonymousComplaint;
