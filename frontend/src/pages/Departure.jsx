import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusFormPage from '../components/BusForm.jsx';

function BusDeparts() {
    const navigate = useNavigate();


    const [suggestions, setSuggestions] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [searchActive, setSearchActive] = useState(false);


    const [modal, setModal] = useState({ show: false, message: "", isError: false });

    // Ключ для очищення форми
    const [formKey, setFormKey] = useState(Date.now());

    const pageConfig = {
        title: {
            topText: "ВИЇЗД",
            highlightedText: "АВТОБУСА",
            bottomText: "З ПАРКУ НА МАРШРУТ"
        },
        fields: [
            { id: 'driverName', placeholder: 'Введіть ПІБ водія або номер' },
            { id: 'busNumber', placeholder: 'Номер автобуса' },
            { id: 'routeNumber', placeholder: 'Номер маршруту' }
        ],
        buttonText: "ВИЇЗД"
    };

    const handleSearch = async (fieldId, value) => {
        if (value.trim().length > 0) {
            setSearchActive(true);
            try {
                const response = await fetch(`http://localhost:5000/api/buses/search?query=${value}`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Помилка пошуку:", error);
            }
        } else {
            setSearchActive(false);
            setSuggestions([]);
        }
    };

    const handleDepart = async () => {
        if (!selectedBus) {
            setModal({
                show: true,
                message: "Будь ласка, спочатку оберіть автобус із випадаючого списку!",
                isError: true
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/buses/${selectedBus.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'route' }),
            });

            if (response.ok) {
                setFormKey(Date.now()); // Очищуємо поля форми
                setModal({
                    show: true,
                    message: `Автобус №${selectedBus.route_number} успішно виїхав на маршрут!`,
                    isError: false
                });
            } else {
                const data = await response.json();
                setModal({
                    show: true,
                    message: data.message || "Не вдалося змінити статус автобуса.",
                    isError: true
                });
            }
        } catch (error) {
            setModal({
                show: true,
                message: "Помилка з'єднання з сервером. Перевірте роботу backend-частини.",
                isError: true
            });
        }
    };

    const closeModal = () => {
        setModal({ ...modal, show: false });
        setSelectedBus(null);
    };

    return (
        <>
            <BusFormPage
                key={formKey}
                title={pageConfig.title}
                fieldsConfig={pageConfig.fields}
                submitButtonText={pageConfig.buttonText}
                onSubmit={handleDepart}
                onInputChange={handleSearch}
                suggestions={suggestions}
                searchActive={searchActive}
                onSelectSuggestion={(bus) => {
                    setSelectedBus(bus);
                    setSearchActive(false);
                }}
            />

            {modal.show && (
                <div className="modal-overlay">
                    <div className="modal-window">
                        <h2 className={modal.isError ? "status-error" : "status-success"}>
                            {modal.isError ? "УПС! ПОМИЛКА" : "УСПІШНО!"}
                        </h2>
                        <p className="modal-text">{modal.message}</p>

                        <div className="modal-buttons">
                            {!modal.isError ? (
                                <>
                                    <button className="btn-modal yellow" onClick={() => navigate('/on-route')}>
                                        ПЕРЕГЛЯНУТИ МАРШРУТИ
                                    </button>
                                    <button className="btn-modal white" onClick={closeModal}>
                                        ВИПУСТИТИ ЩЕ ОДИН
                                    </button>
                                    <button className="btn-modal white" onClick={() => navigate('/')}>
                                        НА ГОЛОВНУ
                                    </button>
                                </>
                            ) : (

                                <button className="btn-modal yellow" onClick={closeModal}>
                                    ЗРОЗУМІЛО
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BusDeparts;