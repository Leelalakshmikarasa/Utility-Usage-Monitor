import React, { useState } from "react";

import "./Login.css";

import { useNavigate } from "react-router-dom";

import Navbar from "../common/Navbar";

import api from "../../api";

import { User, Lock, Eye, Zap } from "lucide-react";

function Login() {

    const [form, setForm] = useState({ email: "", password: "" });

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) =>

        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {

        e.preventDefault();

        // ✅ FRONTEND VALIDATION

        if (!form.email) {

            setMessage("Email is required");

            return;

        }

        if (/[A-Z]/.test(form.email)) {

            setMessage("Invalid email or password");

            return;

        }


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(form.email)) {

            setMessage("Invalid email format");

            return;

        }

        if (!form.password) {

            setMessage("Password is required");

            return;

        }

        setMessage("");

        try {

            const res = await api.post("/auth/login", form);

            const token =

                typeof res.data === "string"

                    ? res.data

                    : res.data.token;

            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split(".")[1]));

            const role =

                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (role === "Supervisor") navigate("/supervisor");

            else if (role === "Technician") navigate("/technician");

            else navigate("/consumer");

        } catch (err) {

            // ✅ BACKEND ERROR HANDLING

            if (err.response) {

                if (err.response.status === 400) {

                    setMessage("Invalid email or password");

                }

                else if (err.response.status === 401) {

                    setMessage("Invalid email or password");

                }

                else if (err.response.status === 404) {

                    setMessage("Invalid email or password");

                }

                else {

                    setMessage("Login failed. Try again");

                }

            } else {

                setMessage("Server not reachable");

            }

        }

    };

    return (
        <>
            <Navbar />

            <div

                className="login-container"

                style={{

                    backgroundImage: `url(${process.env.PUBLIC_URL}/powerstation.jpg)`,

                    backgroundSize: "cover",

                    backgroundPosition: "center",

                    backgroundRepeat: "no-repeat"

                }}
            >

                {/* LEFT SECTION */}
                <div className="left-section">
                    <div className="content">
                        <h1>

                            Monitor. Analyze.
                            <br />

                            Optimize <span>Energy</span>
                        </h1>
                        <p>Track electricity usage and gain insights.</p>
                        <div className="features">
                            <div>📈 Real-time Monitoring</div>
                            <div>📊 Smart Analytics</div>
                            <div>🛡 Secure System</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="right-section">
                    <div className="login-card">
                        <div className="logo-circle">
                            <Zap />
                        </div>

                        <h2>Welcome 👋</h2>
                        <p>Sign in to continue</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <User />
                                <input

                                    name="email"

                                    type="email"

                                    placeholder="Enter email"

                                    value={form.email}

                                    onChange={handleChange}

                                    required

                                />
                            </div>

                            <div className="input-group">
                                <Lock />
                                <input

                                    name="password"

                                    type={showPassword ? "text" : "password"}

                                    placeholder="Enter password"

                                    value={form.password}

                                    onChange={handleChange}

                                    required

                                />
                                <Eye

                                    style={{ cursor: "pointer" }}

                                    onClick={() => setShowPassword(!showPassword)}

                                />
                            </div>

                            <button type="submit" className="login-btn">

                                Sign In →
                            </button>
                        </form>

                        {message && <p className="message">{message}</p>}

                        <p className="signup">

                            Don’t have an account?
                            <span onClick={() => navigate("/register")}>

                                Sign up
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>

    );

}

export default Login;

