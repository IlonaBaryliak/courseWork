import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusFormPage from '../components/BusForm.jsx';

function AddBus() {
    const navigate = useNavigate();

    const [modal, setModal] = useState({
        show: false,
        message: "",
        isError: false
    });

    const [formKey, setFormKey] = useState(Date.now());

    const pageTitle = {
        topText: "ДОДАВАННЯ НОВОГО",
        highlightedText: " АВТОБУСА"
    };

    const fields = [
        { id: 'driver_name', placeholder: 'Введіть ПІБ водія' },
        { id: 'bus_number', placeholder: 'Номер автобуса' },
        { id: 'route_number', placeholder: 'Номер маршруту' }
    ];

    const handleAddBus = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/buses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormKey(Date.now()); // Очищуємо поля
                setModal({
                    show: true,
                    message: "Автобус успішно додано до бази даних!",
                    isError: false
                });
            } else {

                setModal({
                    show: true,
                    message: data.message || "Сталася помилка при збереженні",
                    isError: true
                });
            }
        } catch (error) {
            setModal({
                show: true,
                message: "Не вдалося підключитися до сервера. Перевірте з'єднання.",
                isError: true
            });
        }
    };

    const closeModal = () => setModal({ ...modal, show: false });

    return (
        <>
            <BusFormPage
                key={formKey}
                title={pageTitle}
                fieldsConfig={fields}
                submitButtonText="Додати"
                onSubmit={handleAddBus}
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
                                // Варіанти при успіху
                                <>
                                    <button className="btn-modal yellow" onClick={() => navigate('/parked')}>
                                        Переглянути списки
                                    </button>
                                    <button className="btn-modal white" onClick={closeModal}>
                                        Продовжити додавати
                                    </button>
                                    <button className="btn-modal white" onClick={() => navigate('/')}>
                                        На головну
                                    </button>
                                </>
                            ) : (
                                // Варіант при помилці
                                <button className="btn-modal yellow" onClick={closeModal}>
                                    СПРОБУВАТИ ЩЕ РАЗ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddBus;