import React, { useState, useEffect } from 'react';
import "../styles/BusList.css"; // Використовуємо той самий файл стилів

function AllBuses() {
    const [buses, setBuses] = useState([]);

    const fetchAllBuses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/buses/all');
            const data = await response.json();
            setBuses(data);
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    useEffect(() => {
        fetchAllBuses();
    }, []);

    return (
        <div className="list-page-container">
            <h1 className="list-title">ЗАГАЛЬНИЙ СПИСОК АВТОПАРКУ</h1>

            <div className="stats-info">
                Всього зареєстровано: <strong>{buses.length}</strong>
            </div>

            <table className="bus-table">
                <thead>
                <tr>
                    <th>№ п/п</th>
                    <th>Маршрут</th>
                    <th>Водій</th>
                    <th>Держ. номер</th>
                    <th>Поточний статус</th>
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
                                <span className={bus.status === 'park' ? "btn-table yellow" : "btn-table white"}>
                                    {bus.status === 'park' ? 'У ПАРКУ' : 'НА МАРШРУТІ'}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllBuses;