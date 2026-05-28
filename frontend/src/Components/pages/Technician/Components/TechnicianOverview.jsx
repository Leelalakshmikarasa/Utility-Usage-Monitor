import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function TechnicianOverview({ complaints, consumers }) {

    const totalComplaints = complaints.length;
    const pending = complaints.filter(c => c.status === "Pending").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    const totalConsumers = consumers.length;


    /* ===== BAR CHART ===== */
    const chartData = {
        labels: ["Pending", "Resolved"],
        datasets: [
            {
                data: [pending, resolved],
                backgroundColor: ["#fb923c", "#22c55e"],
                borderRadius: 8,
                barThickness: 50
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="overview-container">

            {/* ===== HEADER ===== */}
            <div className="overview-header">
                <h2>Dashboard</h2>
                <p>Quick summary of today’s activity</p>
            </div>

            {/* ===== TOP CARDS ===== */}
            <div className="overview-cards">

                <div className="card">
                    <h1>{totalComplaints}</h1>
                    <p>Total Complaints</p>
                </div>

                <div className="card">
                    <h1 className="orange">{pending}</h1>
                    <p>Pending</p>
                </div>

                <div className="card">
                    <h1 className="green">{resolved}</h1>
                    <p>Resolved</p>
                </div>

                <div className="card">
                    <h1>{totalConsumers}</h1>
                    <p>Consumers</p>
                </div>

            </div>

            {/* ===== BOTTOM GRID ===== */}
            <div className="overview-grid">

                {/* ===== RECENT COMPLAINTS ===== */}
                <div className="panel large">
                    <h3>Recent Complaints</h3>

                    {complaints.slice(0, 5).map((c, i) => (
                        <div className="tech-row" key={i}>
                            <div className="tech-info">
                                <strong>{c.username}</strong>
                                <p>{c.deviceName} • {c.address}</p>
                            </div>

                            <span className={c.status === "Pending" ? "pending" : "success"}>
                                {c.status}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ===== STATUS CHART ===== */}
                <div className="panel">
                    <h3>Complaint Status</h3>

                    <div style={{ height: "220px" }}>
                        <Bar data={chartData} options={options} />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TechnicianOverview;