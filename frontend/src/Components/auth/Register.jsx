import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Login.css"; 
import Navbar from "../common/Navbar";
import {
    User,
    Mail,
    Lock,
    Phone,
    Home,
    Users,
    Zap,
    BarChart3
} from "lucide-react";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "Consumer",
        phoneNumber: "",
        address: ""
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post("/auth/register", form);
            setMessage("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setMessage(err.response?.data || "Registration failed");
        }
    };

    return (
        <>
        <Navbar/>

        <div className="container">

            {/* LEFT SECTION */}
            <div className="left-section">

                <div className="icon-box">
                    <Zap className="zap-icon" />
                </div>

                <h1>Create Account</h1>
                <p className="subtitle">
                    Register to access Utility Management System
                </p>

                <form onSubmit={submit}>

                    {/* USERNAME */}
                    <div className="input-box">
                        <User className="input-icon" />
                        <input
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="input-box">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-box">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ROLE */}
                    <div className="input-box">
                        <Users className="input-icon" />
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="Consumer">Consumer</option>
                            <option value="Technician">Technician</option>
                            <option value="Supervisor">Supervisor</option>
                        </select>
                    </div>

                    {/* PHONE */}
                    <div className="input-box">
                        <Phone className="input-icon" />
                        <input
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="input-box">
                        <Home className="input-icon" />
                        <input
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Register
                    </button>
                </form>

                {message && <p className="message">{message}</p>}

                <div className="divider">
                    <div className="line"></div>
                    <span>or</span>
                    <div className="line"></div>
                </div>

                <p className="signup-text">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/")}>Login</span>
                </p>
            </div>

            {/* RIGHT SECTION (SAME AS LOGIN) */}
            {/* RIGHT SECTION */}
            <div className="right-section">
                <div className="content">

                    <h3>Monitor Your Electricity Consumption</h3>
                    <p>

                        Track usage, analyze trends and manage your Consumptions.
                    </p>

                    {/* DASHBOARD */}
                    <div className="dashboard-card">

                        <div className="top-bar">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="graph">
                            <div className="bar bar1"></div>
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                            <div className="bar bar4"></div>
                            <div className="bar bar5"></div>
                            <div className="bar bar6"></div>
                            <div className="bar bar7"></div>
                        </div>

                        <div className="stats">
                            {/* <div className="stat-box">
                                <Zap className="stat-icon" />
                                <h3>230 V</h3>
                                <p>Voltage</p>
                            </div>*/}

                            <div className="stat-box">
                                <BarChart3 className="stat-icon" />
                                <h3>1200</h3>
                                <p>kWh Usage</p>
                            </div>

                            {/*<div className="stat-box">
                                <Gauge className="stat-icon" />
                                <h3>82%</h3>
                                <p>Efficiency</p>
                            </div>*/}
                        </div>
                    </div>

                    {/* METER */}
                    <div className="meter">
                        <div className="meter-inner">
                            <Zap className="meter-icon" />
                            <div className="meter-display">1287.45</div>
                            <p>kWh</p>

                            <div className="meter-line">
                                <div className="meter-fill"></div>
                            </div>
                        </div>
                    </div>

                    {/* TOWER */}
                    <img

                        src="https://cdn-icons-png.flaticon.com/512/2942/2942813.png"

                        alt="tower"

                        className="tower"

                    />
                </div>
            </div>
            </div>
        </>
    );
}

export default Register;