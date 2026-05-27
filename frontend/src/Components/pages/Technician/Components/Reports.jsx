import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Reports({ reportUsers = [] }) {
    const [selectedConsumer, setSelectedConsumer] = useState("");

    const deviceSet = new Set();
    const datasets = [];

    const filteredUsers = reportUsers.filter(
        (u) => u.username === selectedConsumer
    );

    filteredUsers.forEach((user, index) => {
        const deviceMap = {};

        user.devices.forEach((d) => {
            if (d.highestConsumptionMonth) {
                deviceSet.add(d.deviceName);
                deviceMap[d.deviceName] = {
                    units: d.highestConsumptionMonth.totalUnits,
                    month: d.highestConsumptionMonth.month,
                    year: d.highestConsumptionMonth.year
                };
            }
        });

        datasets.push({
            label: user.username,
            data: [],
            meta: deviceMap,
            backgroundColor: "#2563eb",
            borderRadius: 6
        });
    });

    const labels = Array.from(deviceSet);

    datasets.forEach(ds => {
        ds.data = labels.map(label => ds.meta[label]?.units || 0);
    });

    const chartData = { labels, datasets };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const meta = datasets[ctx.datasetIndex].meta[ctx.label];
                        return meta
                            ? [`Units: ${meta.units}`, `Month: ${meta.month}`, `Year: ${meta.year}`]
                            : `${ctx.parsed.y} units`;
                    }
                }
            }
        }
    };

    return (
        <div className="section-card">
            <h3>Reports</h3>

            {/* ✅ DROPDOWN */}
            <select
                value={selectedConsumer}
                onChange={(e) => setSelectedConsumer(e.target.value)}
            >
                <option value="">Select Consumer</option>
                {reportUsers.map((u) => (
                    <option key={u.userId} value={u.username}>
                        {u.username}
                    </option>
                ))}
            </select>

            {/* ✅ GRAPH */}
            {selectedConsumer && (
                <div style={{ height: "300px", marginTop: "20px" }}>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}

export default Reports;
