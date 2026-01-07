import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiCircle, FiInfo } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-hot-toast';
import './mealPicker.scss';

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast / Tiffin' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' }
];

const MealPicker = () => {
    const [choices, setChoices] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyChoices = async () => {
            try {
                const response = await api.get('/meals/my-choices');
                const choicesMap = {};
                response.data.forEach(item => {
                    const dateStr = new Date(item.date).toDateString();
                    if (!choicesMap[dateStr]) choicesMap[dateStr] = {};
                    choicesMap[dateStr][item.mealType] = item.preference;
                });
                setChoices(choicesMap);
            } catch (error) {
                console.error('Error fetching choices:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyChoices();
    }, []);

    const handleChoice = async (mealType, preference) => {
        const today = new Date();
        const dateStr = today.toDateString();

        try {
            await api.post('/meals/choose', {
                date: today,
                mealType,
                preference
            });

            setChoices(prev => ({
                ...prev,
                [dateStr]: {
                    ...(prev[dateStr] || {}),
                    [mealType]: preference
                }
            }));
            toast.success(`${mealType} set to ${preference.replace('_', ' ')}`);
        } catch (error) {
            toast.error('Failed to save choice');
        }
    };

    if (isLoading) return <div className="meal-picker-loader">Loading preferences...</div>;

    const todayStr = new Date().toDateString();
    const todayChoices = choices[todayStr] || {};

    return (
        <div className="meal-picker-v2">
            <div className="picker-header">
                <h3>🍽️ Today's Food Choice</h3>
                <p>Select your preference for today's meals.</p>
            </div>

            <div className="meals-selection-grid">
                {MEAL_TYPES.map((meal) => (
                    <div key={meal.id} className="meal-choice-card">
                        <span className="meal-label">{meal.label}</span>
                        <div className="options-row">
                            <button
                                className={`option-btn veg ${todayChoices[meal.id] === 'veg' ? 'active' : ''}`}
                                onClick={() => handleChoice(meal.id, 'veg')}
                            >
                                {todayChoices[meal.id] === 'veg' ? <FiCheckCircle /> : <FiCircle />}
                                Veg
                            </button>
                            <button
                                className={`option-btn non-veg ${todayChoices[meal.id] === 'non_veg' ? 'active' : ''}`}
                                onClick={() => handleChoice(meal.id, 'non_veg')}
                            >
                                {todayChoices[meal.id] === 'non_veg' ? <FiCheckCircle /> : <FiCircle />}
                                Non-Veg
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="picker-footer">
                <FiInfo />
                <span>Preferences help us minimize food waste. Please select daily!</span>
            </div>
        </div>
    );
};

export default MealPicker;
