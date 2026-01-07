import React, { useState, useEffect } from 'react';
import { FiUsers, FiActivity, FiArrowRight } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import './liveMealStats.scss';

const LiveMealStats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/meals/stats/today');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching meal stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();

        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="stats-loader">Calculating headcounts...</div>;

    const findMealStats = (type) => stats.find(s => s._id === type) || { veg: 0, nonVeg: 0 };

    return (
        <div className="live-meal-stats-card">
            <div className="card-header">
                <div>
                    <h3>👨‍🍳 Today's Headcount</h3>
                    <p>Real-time dining preferences from students.</p>
                </div>
                <div className="live-badge">
                    <span className="pulse"></span> LIVE
                </div>
            </div>

            <div className="meal-stats-grid">
                {[
                    { id: 'breakfast', label: 'Breakfast / Tiffin' },
                    { id: 'lunch', label: 'Lunch' },
                    { id: 'dinner', label: 'Dinner' }
                ].map((meal) => {
                    const mealData = findMealStats(meal.id);
                    return (
                        <div key={meal.id} className="meal-stat-row">
                            <div className="meal-info">
                                <strong>{meal.label}</strong>
                                <span>Total: {mealData.veg + mealData.nonVeg} persons</span>
                            </div>
                            <div className="preference-split">
                                <div className="split-item veg">
                                    <span className="label">VEG</span>
                                    <span className="count">{mealData.veg}</span>
                                </div>
                                <div className="split-item non-veg">
                                    <span className="label">NON-VEG</span>
                                    <span className="count">{mealData.nonVeg}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card-footer">
                <FiActivity />
                <span>Data helps in optimized food preparation and cost saving.</span>
            </div>
        </div>
    );
};

export default LiveMealStats;
