import { useState, useEffect } from "react";
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

    useEffect(() => {
        if (reportUsers.length > 0 && !selectedConsumer) {
            setSelectedConsumer(reportUsers[0].username);
        }
    }, [reportUsers, selectedConsumer]);

    const deviceSet = new Set();
    const datasets = [];

    const filteredUsers = reportUsers.filter(
        u => u.username === selectedConsumer
    );

    filteredUsers.forEach(user => {
        const deviceMap = {};

        user.devices.forEach(d => {
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
            borderRadius: 8,
            barThickness: 30,
            backgroundColor: "#3b82f6"
        });
    });

    const labels = Array.from(deviceSet);

    datasets.forEach(ds => {
        ds.data = labels.map(label => ds.meta[label]?.units || 0);
    });

    const chartData = { labels, datasets };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: "#cbd5f5" }
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const meta = datasets[ctx.datasetIndex].meta[ctx.label];
                        return meta
                            ? [`Units: ${meta.units}`, `Month: ${meta.month}`, `Year: ${meta.year}`]
                            : `${ctx.parsed.y} units`;
                    }
                }
            }
        },
        scales: {
            x: { ticks: { color: "#94a3b8" } },
            y: { ticks: { color: "#94a3b8" } }
        }
    };

    return (
        <div className="report-page">

            <div className="report-header">
                <h2>Usage Reports</h2>
                <p>Device-wise highest consumption per consumer</p>
            </div>

            <div className="report-filter-card">
                <label>Select Consumer</label>
                <select
                    value={selectedConsumer}
                    onChange={e => setSelectedConsumer(e.target.value)}
                >
                    {reportUsers.map(u => (
                        <option key={u.userId} value={u.username}>
                            {u.username}
                        </option>
                    ))}
                </select>
            </div>

            <div className="report-chart-card">
                <div className="chart-wrapper">
                    <div className="chart-inner-large">
                        <Bar data={chartData} options={options} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Reports;