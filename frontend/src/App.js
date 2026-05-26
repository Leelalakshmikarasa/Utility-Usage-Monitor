import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./Components/auth/Login";

import Register from "./Components/auth/Register";

import SupervisorDashboard from "./Components/pages/supervisor/SupervisorDashboard";

import TechnicianDashboard from "./Components/pages/TechnicianDashboard";

import UserDashboard from "./Components/pages/user/UserDashboard";

import Navbar from "./Components/common/Navbar";

// ✅ Layout Wrapper

function Layout() {

    const location = useLocation();

    // ✅ Define auth pages

    const authRoutes = ["/", "/register"];

    // ✅ Hide Navbar on login/register pages

    const hideNavbar = authRoutes.includes(location.pathname);

    return (
        <div className="app-container">

            {/* ✅ Navbar (only after login pages) */}

            {!hideNavbar && (
                <div className="navbar-wrapper">
                    <Navbar />
                </div>

            )}

            {/* ✅ Page Content */}
            <div className="page-content">
                <Routes>

                    {/* AUTH ROUTES */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* DASHBOARD ROUTES */}
                    <Route path="/supervisor" element={<SupervisorDashboard />} />
                    <Route path="/technician" element={<TechnicianDashboard />} />
                    <Route path="/consumer" element={<UserDashboard />} />
                </Routes>
            </div>
        </div>

    );

}

// ✅ MAIN APP

function App() {

    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>

    );

}

export default App;

