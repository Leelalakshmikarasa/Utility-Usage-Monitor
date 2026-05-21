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
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    /* ✅ FRONTEND VALIDATION (MATCHES BACKEND) */
    const validate = () => {
        const errs = {};
        // Username
        if (form.username.length < 3) {
            errs.username = "Username must be at least 3 characters";
        }
        // Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Invalid email format";
        }
        // Password
        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(form.password)
        ) {
            errs.password =
                "Password must contain uppercase, lowercase, number & special character";
        }
        // Phone Number
        if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
            errs.phoneNumber = "Invalid phone number";
        }
        // Address
        if (form.address.length < 3) {
            errs.address = "Address must be at least 3 characters";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const submit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!validate()) return;
        try {
            await api.post("/auth/register", form);
            setMessage("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            let errorMsg =
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message || "Server error";
            if (errorMsg.toLowerCase().includes("exists")) {
                setMessage("⚠️ Already registered. Please login.");
            } else {
                setMessage(errorMsg);
            }
        }
    };
    return (
<div className="auth-container">
<h2>Register</h2>
<form onSubmit={submit}>
<div className="form-group">
<label>Username</label>
<input name="username" onChange={handleChange} />
                    {errors.username && <small>{errors.username}</small>}
</div>
<div className="form-group">
<label>Email</label>
<input name="email" type="email" onChange={handleChange} />
                    {errors.email && <small>{errors.email}</small>}
</div>
<div className="form-group">
<label>Password</label>
<input name="password" type="password" onChange={handleChange} />
                    {errors.password && <small>{errors.password}</small>}
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
                    {errors.phoneNumber && <small>{errors.phoneNumber}</small>}
</div>
<div className="form-group">
<label>Address</label>
<input name="address" onChange={handleChange} />
                    {errors.address && <small>{errors.address}</small>}
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