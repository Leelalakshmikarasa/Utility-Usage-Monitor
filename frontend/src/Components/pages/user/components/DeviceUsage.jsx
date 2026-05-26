import React, { useEffect, useState } from "react";
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
    PointElement,   // ✅ REQUIRED
    LineElement,    // ✅ REQUIRED
    Tooltip,
    Legend
);

function DeviceUsage({ userId, devices }) {

    const [consumption, setConsumption] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const years = [];
    for (let y = 2020; y <= 2026; y++) years.push(y);

    // ✅ SAFETY: avoid API call if userId missing
    useEffect(() => {
        if (!userId) return;

        const load = async () => {
            try {
                const res = await api.get(`/user/${userId}/consumption`);

                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.consumptions || [];

                console.log("Consumption Data:", data); 

                setConsumption(data);
            } catch (err) {
                console.error("Error fetching consumption:", err);
            }
        };

        load();
    }, [userId]);

    // ✅ PROCESS DATA (FIXED)
    const monthlyUnits = Array(12).fill(0);

    consumption.forEach(c => {
        if (!c || !c.date) return;

        const d = new Date(c.date);

        const deviceMatch =
            Number(c.utilityDeviceId) === Number(selectedDeviceId);

        const yearMatch =
            d.getFullYear() === Number(selectedYear);

        if (deviceMatch && yearMatch) {
            monthlyUnits[d.getMonth()] += Number(c.units || 0);
        }
    });

    const hasData = monthlyUnits.some(v => v > 0);

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Monthly Consumption (Units)",
            data: monthlyUnits,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            tension: 0.4,
            fill: true
        }]
    };

    return (
        <div className="section-card">

            <h3>Device Usage</h3>

            {/* ✅ DEVICE SELECT */}
            <select
                value={selectedDeviceId}
                onChange={e => setSelectedDeviceId(e.target.value)}
            >
                <option value="">Select Device</option>
                {devices.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.deviceName}
                    </option>
                ))}
            </select>

            {/* ✅ YEAR SELECT */}
            <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
            >
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>

            {/* ✅ NO DATA MESSAGE */}
            {!hasData && selectedDeviceId && (
                <p style={{ marginTop: "10px", color: "#888" }}>
                    No consumption data available
                </p>
            )}

            {/* ✅ GRAPH */}
            {hasData && (
                <div className="graph-wrapper">
                    <div className="graph-container">
                        <Line key={selectedDeviceId + selectedYear} data={chartData} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeviceUsage;