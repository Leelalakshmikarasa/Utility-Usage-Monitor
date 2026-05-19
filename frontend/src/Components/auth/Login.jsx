import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./Login.css";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await api.post("/auth/login", form);

            const token =
                typeof res.data === "string"
                    ? res.data
                    : res.data.token;

            if (!token) {
                setMessage("Invalid login response");
                return;
            }

            // ✅ Save token
            localStorage.setItem("token", token);

            // ✅ Decode role
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role =
                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setMessage("✅ Login successful");

            // ✅ Redirect
            if (role === "Supervisor") navigate("/supervisor");
            else if (role === "Technician") navigate("/technician");
            else navigate("/consumer");

        } catch (err) {
            setMessage(err.response?.data || "Server error");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>

            <form onSubmit={submit}>

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

                <button type="submit">Login</button>

            </form>

            <br />

            {message && <p>{message}</p>}

            {/* ✅ Navigation */}
            <p>
                Don’t have an account?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>
                    Register here
                </span>
            </p>
        </div>
    );
}

export default Login;
