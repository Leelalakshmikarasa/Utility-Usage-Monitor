import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Login.css";
import Navbar from "../common/Navbar";
import { User, Mail, Lock, Phone, Home, Users, Zap } from "lucide-react";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Consumer",
        phoneNumber: "",
        address: ""
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();

        // ✅ CONFIRM PASSWORD VALIDATION
        if (form.password !== form.confirmPassword) {
            setMessage("❌ Password and Confirm Password do not match");
            return; // ⛔ STOP SUBMISSION
        }

        try {
            await api.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password,
                role: form.role,
                phoneNumber: form.phoneNumber,
                address: form.address
            });

            setMessage("✅ Registration successful!");
            setTimeout(() => navigate("/"), 1500);
        } catch {
            setMessage("❌ Registration failed");
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
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed"
                }}
            >
                {/* LEFT */}
                <div className="left-section">
                    <div className="content">
                        <h1>
                            Monitor. Analyze.<br />
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

                {/* RIGHT */}
                <div className="right-section">
                    <div className="login-card register-card">
                        <div className="logo-circle"><Zap /></div>
                        <h2>Create Account</h2>

                        <form onSubmit={submit} className="register-grid">

                            <div className="input-group">
                                <User />
                                <input name="username" placeholder="Username" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <Mail />
                                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <Lock />
                                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <Lock />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                    style={{
                                        borderColor:
                                            message.includes("do not match") ? "#ef4444" : "transparent"
                                    }}
                                />
                               
                            </div>

                            <div className="input-group">
                                <Users />
                                <select name="role" onChange={handleChange}>
                                    <option>Consumer</option>
                                    <option>Technician</option>
                                    <option>Supervisor</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <Phone />
                                <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                            </div>

                            <div className="input-group full-width">
                                <Home />
                                <input name="address" placeholder="Address" onChange={handleChange} required />
                            </div>

                            <button className="login-btn full-width">
                                Register →
                            </button>

                        </form>

                        {message && <p className="message">{message}</p>}

                        <p className="signup">
                            Already have an account?
                            <span onClick={() => navigate("/")}>Sign in</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;