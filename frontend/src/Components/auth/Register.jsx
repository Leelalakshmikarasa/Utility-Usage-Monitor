import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Register.css";

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
        setMessage("");

        try {
            await api.post("/auth/register", form);
            setMessage("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            if (err.response?.data?.includes("exists")) {
                setMessage("⚠️ Already registered. Please login.");
            } else {
                setMessage(err.response?.data || "Server error");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>

            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Username</label>
                    <input name="username" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input name="password" type="password" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="Consumer">Consumer</option>
                        <option value="Technician">Technician</option>
                        <option value="Supervisor">Supervisor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phoneNumber" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input name="address" onChange={handleChange} />
                </div>

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}

            <p>
                Already registered?{" "}
                <span onClick={() => navigate("/")}>Please sign in</span>
            </p>
        </div>
    );
}

export default Register;