import React, { useState } from "react";

import "./Login.css";

import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";

import api from "../../api";

import {

    User,

    Lock,

    Eye,

    Zap,

    BarChart3,

} from "lucide-react";

function Login() {

    const [form, setForm] = useState({

        email: "",

        password: "",

    });

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // ✅ Handle input change

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value,

        });

    };

    // ✅ Handle login submit

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        console.log("Submitting:", form);

        try {

            const res = await api.post("/auth/login", form);

            const token =

                typeof res.data === "string" ? res.data : res.data.token;

            if (!token) {

                setMessage("Invalid login response");

                return;

            }

            // ✅ Save token

            localStorage.setItem("token", token);

            // ✅ Decode role

            const payload = JSON.parse(atob(token.split(".")[1]));

            const role =

                payload[

                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"

                ];

            setMessage("✅ Login successful");

            // ✅ Redirect

            if (role === "Supervisor") navigate("/supervisor");

            else if (role === "Technician") navigate("/technician");

            else navigate("/consumer");

        } catch (err) {

            console.error(err);

            setMessage(err.response?.data || "Login failed");

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

                <h1>Welcome Back</h1>
                <p className="subtitle">

                    Login to your Utility Management System
                </p>

                {/* ✅ FORM START */}
                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <div className="input-box">
                        <User className="input-icon" />

                        <input

                            name="email"

                            type="email"

                            placeholder="Enter Email"

                            value={form.email}

                            onChange={handleChange}

                            required

                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-box">
                        <Lock className="input-icon" />

                        <input

                            name="password"

                            type={showPassword ? "text" : "password"}

                            placeholder="Password"

                            value={form.password}

                            onChange={handleChange}

                            required

                        />

                        <Eye

                            className="input-icon eye"

                            onClick={() => setShowPassword(!showPassword)}

                        />
                    </div>

                    {/* OPTIONS 
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <span className="forgot">Forgot password?</span>
                    </div>*/}

                    {/* ✅ IMPORTANT FIX */}
                    <button type="submit" className="login-btn">

                        Login
                    </button>

                </form>

                {/* ✅ FORM END */}

                {/* MESSAGE */}

                {message && <p className="message">{message}</p>}

                {/* DIVIDER */}
                <div className="divider">
                    <div className="line"></div>
                    <span>or</span>
                    <div className="line"></div>
                </div>

                {/* SIGNUP */}
                <p className="signup-text">

                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>

                        Sign up
                    </span>
                </p>
            </div>

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

export default Login;

