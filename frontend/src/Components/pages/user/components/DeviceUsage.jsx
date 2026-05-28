import React, { useEffect, useState, useMemo } from "react";
import api from "../../../../api";
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

function DeviceUsage() {

    /* =========================
       GET USER ID FROM TOKEN
    ========================== */
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

    const [devices, setDevices] = useState([]);
    const [consumption, setConsumption] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");

    /* =========================
       FETCH DEVICES + CONSUMPTION
    ========================== */
    useEffect(() => {
        if (!userId) return;

        const load = async () => {
            try {
                const deviceRes = await api.get(`/user/${userId}/devices`);
                const consRes = await api.get(`/user/${userId}/consumption`);

                setDevices(deviceRes.data || []);

                setConsumption(
                    Array.isArray(consRes.data)
                        ? consRes.data
                        : consRes.data.consumptions || []
                );
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };

        load();
    }, [userId]);

    /* =========================
       AUTO SELECT FIRST DEVICE
    ========================== */
    useEffect(() => {
        if (devices.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(devices[0].id);
        }
    }, [devices, selectedDeviceId]);

    /* =========================
       FILTER DATA BY DEVICE
    ========================== */
    const deviceData = consumption.filter(
        c => Number(c.utilityDeviceId) === Number(selectedDeviceId)
    );

    /* =========================
       MONTHLY AGGREGATION
    ========================== */
    const monthlyUnits = useMemo(() => {
        const arr = Array(12).fill(0);
        deviceData.forEach(c => {
            if (!c.date) return;
            const d = new Date(c.date);
            arr[d.getMonth()] += Number(c.units || 0);
        });
        return arr;
    }, [deviceData]);

    const totalUnits = monthlyUnits.reduce((a, b) => a + b, 0);
    const todayUnits = deviceData.slice(-1)[0]?.units || 0;
    const estimatedBill = Math.round(totalUnits * 3);

    /* =========================
       CHART DATA
    ========================== */
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Consumption (kWh)",
                data: monthlyUnits,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.4,
                fill: true
            }
        ]
    };

    return (
        <div style={styles.wrapper}>

            <h2>Device Usage</h2>

            {/* ✅ STATS CARDS */}
            <div style={styles.cards}>
                <Card title="kWh This Month" value={`${totalUnits} kWh`} />
                <Card title="Estimated Bill" value={`₹${estimatedBill}`} />
                <Card title="kWh Today" value={`${todayUnits} kWh`} />
            </div>

            {/* ✅ GRAPH + SIDE PANEL */}
            <div style={styles.graphRow}>

                {/* ✅ GRAPH CARD */}
                <div style={styles.graphCard}>

                    {/* ✅ DEVICE SELECT DROPDOWN */}
                    <select
                        style={styles.select}
                        value={selectedDeviceId}
                        onChange={e => setSelectedDeviceId(e.target.value)}
                    >
                        {devices.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.deviceName}
                            </option>
                        ))}
                    </select>

                    <h3 style={{ marginTop: "15px" }}>Consumption Trend</h3>
                    <Line data={chartData} />

                </div>

                {/* ✅ DEVICE DETAILS */}
                <div style={styles.sideCard}>

                    <h3>
                        Device: {devices.find(d => Number(d.id) === Number(selectedDeviceId))?.deviceName
 || "—"}
                    </h3>

                    <Detail label="Last Reading" value={`${todayUnits} kWh`} />
                    <Detail label="Monthly Total" value={`${totalUnits} kWh`} />
                    <Detail label="Estimated Bill" value={`₹${estimatedBill}`} />

                </div>

            </div>

        </div>
    );
}

/* =========================
   SMALL COMPONENTS
========================= */

const Card = ({ title, value }) => (
    <div style={styles.card}>
        <h2>{value}</h2>
        <p>{title}</p>
    </div>
);

const Detail = ({ label, value }) => (
    <div style={styles.detail}>
        <span>{label}</span>
        <b>{value}</b>
    </div>
);

/* =========================
   STYLES
========================= */

const styles = {

    wrapper: {
        padding: "30px",
        color: "white"
    },

    cards: {
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap"
    },

    card: {
        flex: "1 1 200px",
        background: "#0f1c3f",
        padding: "20px",
        borderRadius: "15px"
    },

    graphRow: {
        display: "flex",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap"
    },

    graphCard: {
        flex: "2 1 400px",
        background: "#0f1c3f",
        padding: "20px",
        borderRadius: "15px"
    },

    sideCard: {
        flex: "1 1 250px",
        background: "#0f1c3f",
        padding: "20px",
        borderRadius: "15px"
    },

    detail: {
        display: "flex",
        justifyContent: "space-between",
        background: "#020617",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "10px"
    },

    select: {
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
        background: "#020617",
        color: "white",
        border: "1px solid #1e293b"
    }
};

export default DeviceUsage;