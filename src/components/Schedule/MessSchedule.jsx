import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCoffee, FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import './schedule.scss';

const MessSchedule = () => {
    const [schedule, setSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await api.get('/schedule/latest');
                setSchedule(response.data);
            } catch (error) {
                console.error('No schedule found');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (isLoading) return (
        <div className="schedule-loader">
            <div className="spinner"></div>
            <p>Loading the latest menu...</p>
        </div>
    );

    if (!schedule) return (
        <div className="empty-schedule-state">
            <FiCalendar />
            <h3>No Active Menu</h3>
            <p>The mess administration hasn't published the schedule for this week yet.</p>
        </div>
    );

    return (
        <div className="schedule-viewer-v2">
            <div className="viewer-header">
                <div className="header-badge"><FiCheck /> Official Schedule</div>
                <h2>Weekly Dining Menu</h2>
                <p>Valid from <strong>{new Date(schedule.weekStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
            </div>

            <div className="schedule-grid">
                {schedule.menu.map((day) => (
                    <div key={day.day} className="day-card-v2">
                        <div className="day-banner">
                            <h4>{day.day}</h4>
                        </div>

                        <div className="meals-stack">
                            {[
                                { id: 'breakfast', label: 'Breakfast', icon: FiCoffee, data: day.breakfast },
                                { id: 'lunch', label: 'Lunch', icon: FiSun, data: day.lunch },
                                { id: 'dinner', label: 'Dinner', icon: FiMoon, data: day.dinner }
                            ].map((meal) => (
                                <div key={meal.id} className="meal-row">
                                    <div className="meal-info">
                                        <meal.icon />
                                        <span>{meal.label}</span>
                                    </div>
                                    <div className="meal-content">
                                        {meal.data.veg && <div className="food-item veg"><span className="dot"></span> {meal.data.veg}</div>}
                                        {meal.data.nonVeg && <div className="food-item non-veg"><span className="dot"></span> {meal.data.nonVeg}</div>}
                                        {!meal.data.veg && !meal.data.nonVeg && <div className="no-item">Not available</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessSchedule;
