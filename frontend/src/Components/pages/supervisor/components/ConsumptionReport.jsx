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

function ConsumptionReport({ consumptions }) {

    const chartData = {
        labels: consumptions.map(c => c.address),
        datasets: [
            {
                label: "Total Consumption",
                data: consumptions.map(c => c.totalUsage),

                /* ✅ BRIGHTER + GRADIENT LOOK */
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx } = chart;

                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "#60a5fa"); // light top
                    gradient.addColorStop(1, "#1d4ed8"); // dark bottom

                    return gradient;
                },

                borderRadius: 10,

                /* ✅ BETTER SPACING */
                barThickness: 28,
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
                left: 25,   // ✅ add space from left
                right: 15,
                top: 10,
                bottom: 10
            }
        },

        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y} units`
                }
            }
        },

        scales: {
            x: {
                ticks: { color: "#cbd5f5" },
                grid: { display: false }
            },
            y: {
                ticks: {
                    color: "#cbd5f5",
                    callback: (value) => `${value} units`
                },
                grid: {
                    color: "rgba(255,255,255,0.07)"
                }
            }
        }
    };


    return (
        <div className="report-container">

            <div className="report-card">
                <div className="report-header">
                    <h3>Consumption by Address</h3>
                </div>

                <div className="chart-wrapper">
                    <div className="chart-inner-large">
                        <Bar data={chartData} options={options} />
                    </div>
                </div>

                <div className="chart-legend">
                    <span className="dot blue-dot"></span> Total Consumption
                </div>
            </div>

        </div>
    );
   
}

export default ConsumptionReport;