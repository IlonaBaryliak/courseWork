import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx"; // Не забудь імпортувати хедер!

function App() {
    return (
        <BrowserRouter>
            <Header /> {/* Хедер буде на всіх сторінках */}
            <Routes>
                {/* Кажемо: на шляху "/" показуй компонент Home */}
                <Route path="/" element={<Home />} />
                {/* Тут потім додаси інші маршрути */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
