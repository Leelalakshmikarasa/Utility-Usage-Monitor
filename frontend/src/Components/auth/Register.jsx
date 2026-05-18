import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

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

                <div>
                    <label>Username</label><br />
                    <input name="username" onChange={handleChange} required />
                </div>

                <br />

                <div>
                    <label>Email</label><br />
                    <input name="email" type="email" onChange={handleChange} required />
                </div>

                <br />

                <div>
                    <label>Password</label><br />
                    <input name="password" type="password" onChange={handleChange} required />
                </div>

                <br />

                <div>
                    <label>Role</label><br />
                    <select name="role" onChange={handleChange}>
                        <option value="Consumer">Consumer</option>
                        <option value="Technician">Technician</option>
                        <option value="Supervisor">Supervisor</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Phone Number</label><br />
                    <input name="phoneNumber" onChange={handleChange} />
                </div>

                <br />

                <div>
                    <label>Address</label><br />
                    <input name="address" onChange={handleChange} />
                </div>

                <br />

                <button type="submit">Register</button>

            </form>

            <br />

            {message && <p>{message}</p>}

            {/* ✅ Navigation */}
            <p>
                Already registered?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}>
                    Please sign in
                </span>
            </p>
        </div>
    );
}

export default Register;