import React, { useEffect, useState } from "react";
import api from "../../api";
import "./UserDashboard.css";

// ✅ Chart.js – Line graph
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function UserDashboard() {
    // ✅ Get userId from JWT
    const token = localStorage.getItem("token");
    let userId = null;

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId =
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }

    const [user, setUser] = useState(null);

    // ✅ Edit profile
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    // ✅ Data
    const [devices, setDevices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [consumption, setConsumption] = useState([]);

    // ✅ Graph controls
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // ✅ Add complaint
    const [complaintTitle, setComplaintTitle] = useState("");
    const [complaintDescription, setComplaintDescription] = useState("");

    const years = [];
    for (let y = 2020; y <= 2026; y++) years.push(y);

    // ✅ INITIAL LOAD
    useEffect(() => {
        const loadData = async () => {
            const userRes = await api.get(`/user/${userId}`);
            const deviceRes = await api.get(`/user/${userId}/devices`);
            const complaintRes = await api.get(`/user/${userId}/complaints`);
            const consumptionRes = await api.get(`/user/${userId}/consumption`);

            setUser(userRes.data);
            setDevices(deviceRes.data);
            setComplaints(complaintRes.data);
            setConsumption(consumptionRes.data);

            setEditData({
                username: userRes.data.username,
                email: userRes.data.email,
                phoneNumber: userRes.data.phoneNumber,
                address: userRes.data.address
            });
        };

        if (userId) loadData();
    }, [userId]);

    // ✅ SAVE PROFILE
    const saveProfile = async () => {
        const res = await api.put(`/user/${userId}`, editData);
        setUser(res.data);
        setEditMode(false);
    };

    // ✅ ADD COMPLAINT
    const addComplaint = async () => {
        if (!selectedDeviceId || !complaintTitle || !complaintDescription) {
            alert("Select device and enter title & description");
            return;
        }

        await api.post(`/user/${userId}/complaint`, {
            deviceId: Number(selectedDeviceId),
            title: complaintTitle,
            description: complaintDescription
        });

        const res = await api.get(`/user/${userId}/complaints`);
        setComplaints(res.data);

        setComplaintTitle("");
        setComplaintDescription("");
    };

    if (!user) return <p>Loading...</p>;

    /* ✅ BUILD RISING LINE GRAPH DATA */
    const monthlyUnits = Array(12).fill(0);

    consumption.forEach(c => {
        const d = new Date(c.date);
        if (
            c.utilityDeviceId === Number(selectedDeviceId) &&
            d.getFullYear() === Number(selectedYear)
        ) {
            monthlyUnits[d.getMonth()] += c.units;
        }
    });

    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Monthly Consumption (Units)",
                data: monthlyUnits,
                borderColor: "#e11d48",
                backgroundColor: "rgba(225, 29, 72, 0.15)",
                tension: 0.4,        // ✅ smooth rising curve
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: val => `${val} units`
                }
            }
        }
    };

    return (
        <div className="user-dashboard">
            <h2>User Dashboard</h2>

            {/* ✅ CONSUMER / PROFILE */}
            <h3>Consumer Information</h3>
            <p><b>User ID:</b> {user.userId}</p>

            {!editMode ? (
                <>
                    <p><b>Username:</b> {user.username}</p>
                    <p><b>Email:</b> {user.email}</p>
                    <p><b>Phone:</b> {user.phoneNumber}</p>
                    <p><b>Address:</b> {user.address}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </>
            ) : (
                <>
                    <input
                        value={editData.username}
                        onChange={e => setEditData({ ...editData, username: e.target.value })}
                    />

                    <input value={editData.email} disabled /> {/* ✅ NOT editable */}

                    <input
                        value={editData.phoneNumber}
                        onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })}
                    />

                    <input
                        value={editData.address}
                        onChange={e => setEditData({ ...editData, address: e.target.value })}
                    />

                    <button onClick={saveProfile}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
            )}

            <hr />

            {/* ✅ DEVICE USAGE – RISING LINE GRAPH */}
            <h3>Device Usage</h3>

            <select value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)}>
                <option value="">Select Device</option>
                {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.deviceName}</option>
                ))}
            </select>

            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>

            {selectedDeviceId && (
                <div className="chart-container" style={{ height: "350px" }}>
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
            )}

            <hr />

            {/* ✅ ALL COMPLAINTS */}
            <h3>My Complaints</h3>
            <table>
                <thead>
                    <tr>
                        <th>Device</th>
                        <th>Complaint</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((c, i) => (
                        <tr key={i}>
                            <td>{devices.find(d => d.id === c.deviceId)?.deviceName}</td>
                            <td>{c.title}</td>
                            <td>{c.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* ✅ ADD COMPLAINT */}
            <h3>Add Complaint</h3>

            <select value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)}>
                <option value="">Select Device</option>
                {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.deviceName}</option>
                ))}
            </select>

            <input
                placeholder="Complaint Title"
                value={complaintTitle}
                onChange={e => setComplaintTitle(e.target.value)}
            />

            <textarea
                placeholder="Complaint Description"
                value={complaintDescription}
                onChange={e => setComplaintDescription(e.target.value)}
            />

            <button onClick={addComplaint}>Submit</button>
        </div>
    );
}

export default UserDashboard;
