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
        try {
            await api.post("/auth/register", form);
            setMessage("✅ Registration successful!");
            setTimeout(() => navigate("/"), 1500);
        } catch {
            setMessage("Registration failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="particles"></div>

            <div
                className="login-container"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/powerstation.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
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

                <div className="right-section">
                    <div className="login-card">
                        <div className="logo-circle"><Zap /></div>
                        <h2>Create Account</h2>

                        <form onSubmit={submit}>
                            <div className="input-group"><User /><input name="username" placeholder="Username" onChange={handleChange} required /></div>
                            <div className="input-group"><Mail /><input name="email" type="email" placeholder="Email" onChange={handleChange} required /></div>
                            <div className="input-group"><Lock /><input name="password" type="password" placeholder="Password" onChange={handleChange} required /></div>
                            <div className="input-group"><Users /><select name="role" onChange={handleChange}><option>Consumer</option><option>Technician</option><option>Supervisor</option></select></div>
                            <div className="input-group"><Phone /><input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required /></div>
                            <div className="input-group"><Home /><input name="address" placeholder="Address" onChange={handleChange} required /></div>

                            <button className="login-btn">Register →</button>
                        </form>

                        {message && <p className="message">{message}</p>}
                        <p className="signup">
                            Already have an account?
                            <span onClick={() => navigate("/")}>
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;