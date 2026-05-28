import React, { useEffect, useState } from "react";

import api from "../../../../api";

function UserProfile() {

    // ✅ GET USER ID

    const getUserId = () => {

        try {

            const token = localStorage.getItem("token");

            const payload = JSON.parse(atob(token.split(".")[1]));

            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        } catch {

            return null;

        }

    };

    const userId = getUserId();

    // ✅ STATES

    const [user, setUser] = useState(null);

    const [devices, setDevices] = useState([]);

    const [complaints, setComplaints] = useState([]);

    const [consumption, setConsumption] = useState([]);

    const [editMode, setEditMode] = useState(false);

    const [form, setForm] = useState({

        username: "",

        email: "",

        phoneNumber: "",

        address: ""

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    // ✅ FETCH USER DATA

    useEffect(() => {

        const loadUser = async () => {

            try {

                const res = await api.get(`/user/${userId}`);

                setUser(res.data);

                setForm({

                    username: res.data.username || "",

                    email: res.data.email || "",

                    phoneNumber: res.data.phoneNumber || "",

                    address: res.data.address || ""

                });

            } catch (err) {

                console.error("Error fetching user:", err);

            }

        };

        if (userId) loadUser();

    }, [userId]);

    // ✅ FETCH SUMMARY DATA (IMPORTANT FIX)

    useEffect(() => {

        const loadSummary = async () => {

            try {

                const deviceRes = await api.get(`/user/${userId}/devices`);

                const complaintRes = await api.get(`/user/${userId}/complaints`);

                const consumptionRes = await api.get(`/user/${userId}/consumption`);

                setDevices(deviceRes.data || []);

                setComplaints(complaintRes.data || []);

                const consData = Array.isArray(consumptionRes.data)

                    ? consumptionRes.data

                    : consumptionRes.data.consumptions || [];

                setConsumption(consData);

            } catch (err) {

                console.error("Error loading summary:", err);

            }

        };

        if (userId) loadSummary();

    }, [userId]);

    // ✅ HANDLE INPUT

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    // ✅ SAVE PROFILE

    const handleSave = async () => {

        try {

            setLoading(true);

            setMessage("");

            const res = await api.put(`/user/${userId}`, form);

            setUser(res.data);

            setEditMode(false);

            setMessage("✅ Profile updated successfully");

        } catch (err) {

            console.error("Update error:", err);

            setMessage("❌ Failed to update profile");

        } finally {

            setLoading(false);

        }

    };

    if (!user) return <div style={styles.loader}>Loading profile...</div>;

    // ✅ SUMMARY CALCULATIONS

    const resolvedCount =

        complaints.filter(c => c.status?.toLowerCase() === "resolved").length;

    const totalUnits =

        consumption.reduce((sum, c) => sum + (c.units || 0), 0);

    return (
        <div style={styles.wrapper}>

            {/* ✅ LEFT PROFILE */}
            <div style={styles.profileCard}>

                <div style={styles.header}>
                    <div style={styles.avatar}>

                        {user.username?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                        <h2 style={{ margin: 0 }}>{user.username}</h2>
                        <p style={styles.email}>{user.email}</p>
                    </div>
                </div>

                <hr style={styles.divider} />

                {message && <p style={styles.message}>{message}</p>}

                {!editMode ? (
                    <>
                        <Row label="User ID" value={user.userId} />
                        <Row label="Phone" value={user.phoneNumber} />
                        <Row label="Address" value={user.address} />

                        <button style={styles.editBtn} onClick={() => setEditMode(true)}>

                            Edit Profile →
                        </button>
                    </>

                ) : (
                    <div style={styles.form}>
                        <input name="username" value={form.username} onChange={handleChange} style={styles.input} />
                        <input name="email" value={form.email} disabled style={{ ...styles.input, opacity: 0.6 }} />
                        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={styles.input} />
                        <input name="address" value={form.address} onChange={handleChange} style={styles.input} />

                        <div style={styles.btnRow}>
                            <button style={styles.saveBtn} onClick={handleSave}>

                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button style={styles.cancelBtn} onClick={() => setEditMode(false)}>

                                Cancel
                            </button>
                        </div>
                    </div>

                )}
            </div>

            {/* ✅ RIGHT SUMMARY */}
            <div style={styles.summaryCard}>

                <h3 style={{ marginBottom: "15px" }}>Account Summary</h3>

                <Summary label="Registered Devices" value={devices.length} />
                <Summary label="Total Complaints" value={complaints.length} />
                <Summary label="Resolved" value={resolvedCount} />
                <Summary label="kWh This Month" value={totalUnits} />

            </div>
        </div>

    );

}


// ✅ COMPONENTS

const Row = ({ label, value }) => (
    <div style={styles.row}>
        <span>{label}</span>
        <b>{value}</b>
    </div>

);

const Summary = ({ label, value }) => (
    <div style={styles.summaryBox}>
        <span>{label}</span>
        <b>{value}</b>
    </div>

);


// ✅ STYLES

const styles = {

    wrapper: {

        display: "flex",

        gap: "40px",

        padding: "40px",

        width: "100%"

    },

    profileCard: {

        flex: 2,

        background: "#0b1736",

        padding: "30px",

        borderRadius: "20px",

        color: "white"

    },

    summaryCard: {

        flex: 1,

        background: "#0b1736",

        padding: "25px",

        borderRadius: "20px",

        color: "white"

    },

    header: {

        display: "flex",

        gap: "20px"

    },

    avatar: {

        width: "70px",

        height: "70px",

        background: "#2563eb",

        borderRadius: "50%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center"

    },

    email: {

        color: "#94a3b8"

    },

    divider: {

        margin: "20px 0",

        borderColor: "#1e2a4a"

    },

    row: {

        display: "flex",

        justifyContent: "space-between",

        padding: "10px 0"

    },

    editBtn: {

        marginTop: "20px",

        width: "100%",

        padding: "12px",

        background: "#2563eb",

        border: "none",

        borderRadius: "10px",

        color: "white"

    },

    form: { marginTop: "10px" },

    input: {

        width: "100%",

        marginBottom: "10px",

        padding: "10px"

    },

    btnRow: {

        display: "flex",

        gap: "10px"

    },

    saveBtn: {

        flex: 1,

        padding: "10px",

        background: "#2563eb",

        border: "none",

        color: "white"

    },

    cancelBtn: {

        flex: 1,

        padding: "10px",

        background: "#444",

        border: "none",

        color: "white"

    },

    summaryBox: {

        display: "flex",

        justifyContent: "space-between",

        marginTop: "10px",

        background: "#020617",

        padding: "10px",

        borderRadius: "10px"

    },

    loader: {

        color: "white"

    },

    message: {

        color: "#22c55e"

    }

};

export default UserProfile;
