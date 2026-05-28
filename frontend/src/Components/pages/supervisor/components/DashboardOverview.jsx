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

function DashboardOverview({ technicians, consumptions, setSection }) {

    const totalTasks =
        technicians.reduce((sum, t) => sum + t.totalComplaints, 0);

    const resolved =
        technicians.reduce((sum, t) => sum + t.resolvedComplaints, 0);

    const pending =
        technicians.reduce((sum, t) => sum + t.pendingComplaints, 0);

    const activeTechs = technicians.length;

    /* ✅ CHART DATA */
    const chartData = {
        labels: consumptions.map(c => c.address),
        datasets: [
            {
                label: "kWh used",
                data: consumptions.map(c => c.totalUsage),

                backgroundColor: "#3b82f6",
                borderRadius: 6,

                /* ✅ FIXED SPACING */
                barThickness: 24,
                categoryPercentage: 0.5,
                barPercentage: 0.6
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        layout: {
            padding: {
                left: 10,
                right: 10
            }
        },

        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y} kWh`
                }
            }
        },

        scales: {
            x: {
                ticks: { color: "#94a3b8" },
                grid: { display: false }
            },
            y: {
                ticks: { color: "#94a3b8" },
                grid: {
                    color: "rgba(255,255,255,0.05)"
                }
            }
        }
    };

    return (
        <div className="overview-container">

            {/* ✅ HEADER */}
            <div className="overview-header">
                <h2>Overview</h2>
                <p>{activeTechs} technicians active • Updated just now</p>
            </div>

            {/* ✅ TOP CARDS */}
            <div className="overview-cards">

                <div className="card">
                    <h1>{totalTasks}</h1>
                    <p>Total Complaints</p>
                    <span className="badge blue">Raised</span>
                </div>

                <div className="card">
                    <h1>{resolved}</h1>
                    <p>Resolved</p>
                    <span className="badge green">✔ Done</span>
                </div>

                <div className="card">
                    <h1>{pending}</h1>
                    <p>Pending</p>
                    <span className="badge orange">In progress</span>
                </div>

                <div className="card">
                    <h1>{activeTechs}</h1>
                    <p>Technicians</p>
                    <span className="badge purple">Active</span>
                </div>

            </div>

            {/* ✅ MAIN GRID (FIXED LAYOUT) */}
            <div className="overview-grid">

                {/* ✅ ACTIVE TECHNICIANS */}
                <div className="panel large">

                    <div className="panel-header">
                        <h3>Active Technicians</h3>

                        {/* ✅ WORKING CLICK */}
                        <span
                            className="see-all"
                            onClick={() => setSection("technicians")}
                        >
                            See all
                        </span>
                    </div>

                    {technicians.map((t, i) => (
                        <div className="tech-row" key={i}>
                            <div className="avatar-circle">
                                {t.username?.[0]?.toUpperCase()}
                            </div>

                            <div className="tech-info">
                                <strong>{t.username}</strong>
                                <p>{t.address}</p>
                            </div>

                            <div className="tech-stats">
                                <span className="pending">{t.pendingComplaints}</span>
                                <span>{t.totalComplaints}</span>
                                <span className="success">{t.resolvedComplaints}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ CHART PANEL */}
                <div className="panel">
                    <h3>Consumption by Area</h3>

                    <div className="chart-wrapper">
                        <div className="chart-inner">
                            <Bar data={chartData} options={options} />
                        </div>
                    </div>

                    <div className="chart-legend">
                        <span className="dot blue-dot"></span> kWh used
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DashboardOverview;