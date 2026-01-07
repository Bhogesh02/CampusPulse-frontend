import React, { useState, useEffect } from 'react';
import FeedbackPopup from '../Feedback/FeedbackPopup';

const NotificationScheduler = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentMeal, setCurrentMeal] = useState('');

    useEffect(() => {
        const checkMealTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const currentTime = hour + minute / 60;

            let meal = '';
            // Breakfast: 8:00 - 10:00
            if (currentTime >= 8 && currentTime <= 10.5) meal = 'Breakfast';
            // Lunch: 12:30 - 14:30
            else if (currentTime >= 12.5 && currentTime <= 15) meal = 'Lunch';
            // Dinner: 19:30 - 21:30
            else if (currentTime >= 19.5 && currentTime <= 22) meal = 'Dinner';

            if (meal && !localStorage.getItem(`feedback_submitted_${meal}_${now.toDateString()}`)) {
                setCurrentMeal(meal);
                setShowPopup(true);
            } else {
                setShowPopup(false);
            }
        };

        // Initial check
        checkMealTime();

        // Periodic check every 10 minutes
        const interval = setInterval(checkMealTime, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClose = () => {
        const today = new Date().toDateString();
        localStorage.setItem(`feedback_submitted_${currentMeal}_${today}`, 'true');
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return <FeedbackPopup mealType={currentMeal} onClose={handleClose} />;
};

export default NotificationScheduler;
