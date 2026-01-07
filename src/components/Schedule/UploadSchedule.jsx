import React, { useState } from 'react';
import { FiSave, FiCalendar, FiCoffee, FiSun, FiMoon, FiCheckCircle } from 'react-icons/fi';
import api from '../../store/api/axiosBase';
import { toast } from 'react-hot-toast';
import './schedule.scss';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const UploadSchedule = () => {
    const [weekStartDate, setWeekStartDate] = useState('');
    const [menu, setMenu] = useState(
        DAYS.map(day => ({
            day,
            breakfast: { veg: '', nonVeg: '' },
            lunch: { veg: '', nonVeg: '' },
            dinner: { veg: '', nonVeg: '' }
        }))
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (dayIndex, meal, type, value) => {
        const newMenu = [...menu];
        newMenu[dayIndex][meal][type] = value;
        setMenu(newMenu);
    };

    const handleSave = async () => {
        if (!weekStartDate) {
            toast.error('Please select the week start date');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/schedule/upload', { weekStartDate, menu });
            toast.success('Mess schedule uploaded and students notified!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="upload-schedule-container-v2">
            <div className="management-header">
                <div className="text-container">
                    <h2>Weekly Menu Planner</h2>
                    <p>Design a balanced menu for {DAYS.length} days of the week.</p>
                </div>
                <div className="week-selector-card">
                    <div className="input-group">
                        <label><FiCalendar /> Week Starting From</label>
                        <input
                            type="date"
                            value={weekStartDate}
                            onChange={(e) => setWeekStartDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="days-scroller">
                {menu.map((dayData, dayIndex) => (
                    <div key={dayData.day} className="day-management-card">
                        <div className="day-header">
                            <h3>{dayData.day}</h3>
                            <span className="status-dot"></span>
                        </div>

                        <div className="meal-sections">
                            {[
                                { id: 'breakfast', label: 'Breakfast', icon: FiCoffee },
                                { id: 'lunch', label: 'Lunch', icon: FiSun },
                                { id: 'dinner', label: 'Dinner', icon: FiMoon }
                            ].map((meal) => (
                                <div key={meal.id} className="meal-input-box">
                                    <div className="meal-title">
                                        <meal.icon />
                                        <span>{meal.label}</span>
                                    </div>
                                    <div className="preference-grid">
                                        <div className="input-field">
                                            <label className="veg-label">Veg Item</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Poha & Tea"
                                                value={dayData[meal.id].veg}
                                                onChange={(e) => handleInputChange(dayIndex, meal.id, 'veg', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label className="non-veg-label">Non-Veg</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Boiled Egg"
                                                value={dayData[meal.id].nonVeg}
                                                onChange={(e) => handleInputChange(dayIndex, meal.id, 'nonVeg', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sticky-footer">
                <div className="disclaimer">
                    <FiCheckCircle /> Students will receive an email notification once published.
                </div>
                <button className="publish-btn" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Publishing...' : <><FiSave /> Publish Weekly Menu</>}
                </button>
            </div>
        </div>
    );
};

export default UploadSchedule;
