import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import SupervisorDashboard from "./Components/pages/SupervisorDashboard";
import TechnicianDashboard from "./Components/pages/TechnicianDashboard";

// ✅ Import Navbar
import Navbar from "./Components/common/Navbar";

function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Utility Usage Monitor</h1>

                {/* ✅ Navbar added globally */}
                <Navbar />

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/supervisor" element={<SupervisorDashboard />} />
                    <Route path="/technician" element={<TechnicianDashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
