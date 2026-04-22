import React, { useState, useEffect } from 'react';
import "../styles/BusList.css";

function BusList({ statusFilter, title }) {
    const [buses, setBuses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState({ show: false, busId: null });

    // Завантаження даних з сервера
    const fetchBuses = async () => {
        try {
            // Додаємо статус як query-параметр
            const response = await fetch(`http://localhost:5000/api/buses?status=${statusFilter}`);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Сервер повернув помилку:", errorData);
                return;
            }

            const data = await response.json();
            setBuses(data);
        } catch (error) {
            console.error("Помилка підключення:", error);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, [statusFilter]);

    // Зміна статусу (наприклад, з парку на маршрут)
    const handleStatusChange = async (id, newStatus) => {
        await fetch(`http://localhost:5000/api/buses/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchBuses(); // Оновлюємо список
    };

    // Видалення автобуса
    const confirmDelete = async () => {
        await fetch(`http://localhost:5000/api/buses/${showDeleteModal.busId}`, { method: 'DELETE' });
        setShowDeleteModal({ show: false, busId: null });
        fetchBuses(); // Оновлюємо список, номери перерахуються автоматично
    };

    return (
        <div className="list-page-container">
            <h1 className="list-title">{title}</h1>

            <div className="stats-info">
                Кількість автобусів: <strong>{buses.length}</strong>
            </div>

            <table className="bus-table">
                <thead>
                <tr>
                    <th>№ п/п</th>
                    <th>Маршрут</th>
                    <th>ПІБ Водія</th>
                    <th>Держ. номер</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {buses.map((bus, index) => (
                    <tr key={bus.id}>

                        <td>{index + 1}</td>
                        <td>{bus.route_number}</td>
                        <td>{bus.driver_name}</td>
                        <td>{bus.bus_number}</td>
                        <td>
                            <div className="table-actions">
                                <button
                                    className="btn-table yellow"
                                    onClick={() => handleStatusChange(bus.id, bus.status === 'park' ? 'route' : 'park')}
                                >
                                    {bus.status === 'park' ? 'ВИЇЗД' : 'У ПАРК'}
                                </button>
                                <button
                                    className="btn-table white"
                                    onClick={() => setShowDeleteModal({ show: true, busId: bus.id })}
                                >
                                    ВИДАЛИТИ
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showDeleteModal.show && (
                <div className="modal-overlay">
                    <div className="modal-window">
                        <h2>ВИДАЛИТИ АВТОБУС?</h2>
                        <p>Ви впевнені, що хочете видалити цей запис з бази даних?</p>
                        <div className="modal-buttons">
                            <button className="btn-modal yellow" onClick={confirmDelete}>ТАК, ВИДАЛИТИ</button>
                            <button className="btn-modal white" onClick={() => setShowDeleteModal({ show: false, busId: null })}>СКАСУВАТИ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BusList;