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
                backgroundColor: "#2563eb",
                borderRadius: 8,
                barThickness: 30
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: { display: false },

            tooltip: {
                callbacks: {
                    // ✅ FIX 1 (IMPORTANT)
                    label: (ctx) => `${ctx.parsed.y} units`
                }
            }
        },

        scales: {
            y: {
                ticks: {
                    // ✅ FIX 2 (ALSO IMPORTANT)
                    callback: (value) => `${value} units`
                }
            }
        }
    };

    return (
        <div className="section-card">
            <h3>Consumption by Address</h3>

            <div className="graph-wrapper">
                <div className="graph-container">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
}

export default ConsumptionReport;