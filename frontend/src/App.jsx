import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddBuses from "./pages/AddBus.jsx";
import Header from "./components/Header.jsx";
import Departure from "./pages/Departure.jsx";
import BusList from "./pages/BusList.jsx";
import AllBuses from "./pages/AllBuses.jsx";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddBuses />} />
                <Route path="/all-buses" element={<AllBuses />} />
                <Route path="/departure" element={<Departure />} />

                <Route
                    path="/parked"
                    element={<BusList statusFilter="park" title="УСІ АВТОБУСИ У ПАРКУ" />}
                />
                <Route
                    path="/on-route"
                    element={<BusList statusFilter="route" title="УСІ АВТОБУСИ НА МАРШРУТІ" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;