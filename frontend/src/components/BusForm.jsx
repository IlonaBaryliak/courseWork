import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/BusFormPage.css";
import Arrow from "../assets/ArrowCircle.svg";

function BusFormPage({ title, fieldsConfig, submitButtonText, onSubmit, onInputChange, suggestions = [], onSelectSuggestion, searchActive }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    // Додаємо стан, щоб знати, в якому полі зараз курсор
    const [activeField, setActiveField] = useState(null);

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        setActiveField(id); // Фіксуємо активне поле
        if (onInputChange) onInputChange(id, value);
    };

    const handleSelect = (bus) => {
        const fullData = {
            busNumber: bus.bus_number,
            driverName: bus.driver_name,
            routeNumber: bus.route_number
        };
        setFormData(fullData);
        setActiveField(null); // Ховаємо список після вибору
        if (onSelectSuggestion) onSelectSuggestion(bus);
    };

    const handleClear = () => {
        setFormData({});
        setActiveField(null);
        if (onInputChange) onInputChange('', '');
    };

    return (
        <div className="page-wrapper">
            <main className="main-container">
                <div className="content-grid">
                    <div className="title-section">
                        <h1 className="main-title">
                            {title.topText} <br />
                            <span className="highlight">{title.highlightedText}</span>
                            {title.bottomText && <><br /> {title.bottomText}</>}
                        </h1>
                    </div>

                    <div className="form-section">
                        <div className="form-card">
                            {fieldsConfig.map((field) => (
                                <div className="floating-group" key={field.id} style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder=" "
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        // При фокусі теж оновлюємо активне поле
                                        onFocus={() => setActiveField(field.id)}
                                        autoComplete="off"
                                    />
                                    <label className="floating-label">{field.placeholder}</label>

                                    {/* Тепер підказки малюються окремо для кожного поля */}
                                    {searchActive && activeField === field.id && (
                                        <div className="suggestions-list">
                                            {suggestions.length > 0 ? (
                                                suggestions.map((bus) => (
                                                    <div key={bus.id} className="suggestion-item" onClick={() => handleSelect(bus)}>
                                                        <div className="suggestion-route">№ {bus.route_number}</div>
                                                        <div className="suggestion-info">
                                                            <span>Водій: {bus.driver_name}</span>
                                                            <span>Автобус: {bus.bus_number}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-suggestions">Інформації не знайдено</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="button-group">
                                <button className="btn-clear" onClick={handleClear}>ОЧИСТИТИ</button>
                                <button className="btn-submit" onClick={() => onSubmit(formData)}>
                                    {submitButtonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="arrow-left" onClick={() => navigate(-1)}>
                    <img src={Arrow} alt="Назад" />
                </button>
            </main>
        </div>
    );
}

export default BusFormPage;