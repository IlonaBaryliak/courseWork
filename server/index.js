const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bus_control',
    password: 'ilona5',
    port: 5432,
});


const formatToTitleCase = (str) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0) // Видаляємо порожні елементи, якщо було багато пробілів
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// 1. ПОШУК
app.get('/api/buses/search', async (req, res) => {
    const { query } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM buses
             WHERE status = 'park'
               AND (driver_name ILIKE $1 OR bus_number ILIKE $1 OR route_number ILIKE $1)
                 LIMIT 5`,
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Помилка пошуку:", err.message);
        res.status(500).json({ message: 'Помилка пошуку' });
    }
});

// 2. СТВОРЕННЯ (З валідацією номера та форматуванням ПІБ)
app.post('/api/buses', async (req, res) => {
    let { driver_name, bus_number, route_number } = req.body;

    // 1. Валідація номера автобуса (Regex)
    const busNumberRegex = /^[A-ZА-Я]{2}\s?\d{4}\s?[A-ZА-Я]{2}$/i;
    if (!busNumberRegex.test(bus_number)) {
        return res.status(400).json({
            message: "Неправильний формат номера! Використовуйте зразок: ВС 2345 КТ"
        });
    }

    // 2. Валідація номера маршруту (має бути додатнім числом)
    const routeInt = parseInt(route_number);
    if (isNaN(routeInt) || routeInt <= 0) {
        return res.status(400).json({
            message: "Номер маршруту має бути додатнім числом!"
        });
    }

    try {
        // ПІБ з великої літери
        const formattedName = formatToTitleCase(driver_name);

        // Номер автобуса (ВС 1234 КТ)
        const cleanNumber = bus_number.replace(/\s+/g, '').toUpperCase();
        const finalBusNumber = `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 6)} ${cleanNumber.slice(6, 8)}`;

        // ФОРМАТУВАННЯ МАРШРУТУ
        const finalRouteNumber = `R-${routeInt}`;

        // Перевірка на дублікат номера автобуса
        const existingBus = await pool.query('SELECT * FROM buses WHERE bus_number = $1', [finalBusNumber]);
        if (existingBus.rows.length > 0) {
            return res.status(400).json({ message: "Автобус із таким номером вже існує!" });
        }

        const result = await pool.query(
            'INSERT INTO buses (driver_name, bus_number, route_number, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [formattedName, finalBusNumber, finalRouteNumber, 'park']
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Помилка створення:", err.message);
        res.status(500).json({ message: "Помилка на сервері при створенні" });
    }
});

// 3. ОТРИМАННЯ СПИСКУ за статусом
app.get('/api/buses', async (req, res) => {
    const { status } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM buses WHERE status = $1 ORDER BY id ASC',
            [status || 'park']
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Помилка отримання списку:", err.message);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// 4. ОНОВЛЕННЯ СТАТУСУ
app.put('/api/buses/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE buses SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Автобус не знайдено' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Помилка зміни статусу:", err.message);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// 5. ВИДАЛЕННЯ
app.delete('/api/buses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM buses WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Автобус не знайдено в базі" });
        }
        res.json({ message: "Видалено успішно" });
    } catch (err) {
        console.error("Помилка видалення:", err.message);
        res.status(500).json({ message: "Не вдалося видалити" });
    }
});

// 6. ЗАГАЛЬНИЙ РЕЄСТР
app.get('/api/buses/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM buses ORDER BY route_number ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Помилка отримання всіх даних:", err.message);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.listen(5000, () => {
    console.log('Сервер працює на порту 5000');
});