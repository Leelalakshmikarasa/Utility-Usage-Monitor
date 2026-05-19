import React, { useEffect, useState } from "react";
import API from "../../api";

// ✅ Chart.js imports
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

// ✅ Import CSS
import "./SupervisorDashboard.css";

// ✅ Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function SupervisorDashboard() {
    const [technicians, setTechnicians] = useState([]);
    const [consumptions, setConsumptions] = useState([]);

    useEffect(() => {
        fetchTechnicians();
        fetchConsumptions();
    }, []);

    // ✅ Fetch technicians
    const fetchTechnicians = async () => {
        try {
            const res = await API.get("/supervisor/technicians");
            setTechnicians(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setTechnicians([]);
        }
    };

    // ✅ Fetch consumption by address
    const fetchConsumptions = async () => {
        try {
            const res = await API.get("/supervisor/consumptions/by-address");
            setConsumptions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setConsumptions([]);
        }
    };

    // ✅ Chart data
    const consumptionChartData = {
        labels: consumptions.map(c => c.address),
        datasets: [
            {
                label: "Total Usage",
                data: consumptions.map(c => c.totalUsage),
                backgroundColor: "#6366f1",
                borderRadius: 10,
                barThickness: 26,
                categoryPercentage: 0.75,
                barPercentage: 0.9
            }
        ]
    };

    // ✅ Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Total Consumption by Address",
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.parsed.y} units`
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: val => `${val} units`
                }
            }
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Supervisor Dashboard</h2>

            {/* ✅ TECHNICIANS TABLE */}
            <div className="card">
                <h3 className="card-title">Technicians Overview</h3>

                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Technician</th>
                            <th>Area</th>
                            <th>Consumers</th>
                            <th>Total</th>
                            <th>Pending</th>
                            <th>Resolved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.map((t, i) => (
                            <tr key={i}>
                                <td>{t.username}</td>
                                <td>{t.address}</td>
                                <td>{t.consumersCount}</td>
                                <td>{t.totalComplaints}</td>
                                <td className="warning">{t.pendingComplaints}</td>
                                <td className="success">{t.resolvedComplaints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ GRAPH CARD */}
            <div className="card">
                <h3 className="card-title center">Consumption by Address</h3>

                {consumptions.length > 0 ? (
                    <div className="chart-box">
                        <Bar data={consumptionChartData} options={chartOptions} />
                    </div>
                ) : (
                    <p className="no-data">No consumption data available</p>
                )}
            </div>
        </div>
    );
}

export default SupervisorDashboard;