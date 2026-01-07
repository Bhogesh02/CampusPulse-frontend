import React, { useState } from 'react';
import { FiStar, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-hot-toast';
import './feedback.scss';

const FeedbackPopup = ({ mealType, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            await api.post('/feedback', { mealType, rating, comment });
            setIsSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            toast.error('Failed to submit feedback');
        }
    };

    if (isSubmitted) {
        return (
            <div className="feedback-success">
                <FiCheckCircle className="success-icon" />
                <h3>Thank you!</h3>
                <p>Your feedback helps us improve mess quality.</p>
            </div>
        );
    }

    return (
        <div className="feedback-popup-overlay">
            <div className="feedback-card">
                <div className="card-header">
                    <span className="meal-tag">{mealType}</span>
                    <h3>How was the food today?</h3>
                    <p>Rate your experience to help us improve.</p>
                </div>

                <div className="rating-section">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            <FiStar fill={star <= (hover || rating) ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>

                <div className="comment-section">
                    <textarea
                        placeholder="Any improvements needed? (Optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="popup-actions">
                    <button className="skip-btn" onClick={onClose}>Skip</button>
                    <button className="submit-btn" onClick={handleSubmit}>
                        Submit Feedback <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPopup;
