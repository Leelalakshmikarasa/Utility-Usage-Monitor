import React, { useEffect, useState } from "react";
import api from "../../api";
import "./UserDashboard.css";

// ✅ Chart imports
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

function TechnicianDashboard() {
    const [tableData, setTableData] = useState([]);
    const [reportUsers, setReportUsers] = useState([]);

    // ✅ Add Device
    const [newDevice, setNewDevice] = useState({
        userId: "",
        deviceName: ""
    });

    // ✅ Consumer Details
    const [consumerData, setConsumerData] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState({});
    const [filters, setFilters] = useState({});

    // ✅ Reports
    const [selectedConsumer, setSelectedConsumer] = useState("");

    useEffect(() => {
        loadTableData();
        loadReportUsers();
        loadConsumerDetails();
    }, []);

    // ================= COMPLAINTS =================
    const loadTableData = async () => {
        try {
            const res = await api.get("/technician/complaints");
            setTableData(Array.isArray(res.data) ? res.data : []);
        } catch {
            setTableData([]);
        }
    };

    // ================= CONSUMER DETAILS =================
    const loadConsumerDetails = async () => {
        try {
            const res = await api.get("/technician/consumers");
            setConsumerData(res.data || []);
        } catch {
            setConsumerData([]);
        }
    };

    // ================= RESOLVE =================
    const resolveComplaint = async (userId, deviceId) => {
        try {
            await api.put(`/technician/resolve/${userId}/${deviceId}`);
            alert("Resolved ✅");
            loadTableData();
        } catch {
            alert("Error ❌");
        }
    };

    // ================= ADD DEVICE =================
    const addDevice = async () => {
        if (!newDevice.userId || !newDevice.deviceName) {
            alert("Please select user and enter device name");
            return;
        }

        try {
            await api.post("/technician/device", newDevice);
            alert("Added ✅");
            setNewDevice({ userId: "", deviceName: "" });
            loadConsumerDetails();
        } catch {
            alert("Error ❌");
        }
    };

    // ================= REPORT =================
    const loadReportUsers = async () => {
        try {
            const res = await api.get("/technician/report/user-device-month");
            setReportUsers(res.data.users || []);
        } catch {
            setReportUsers([]);
        }
    };

    // ================= GRAPH DATA =================
    const deviceSet = new Set();
    const datasets = [];
    const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

    const filteredUsers = reportUsers.filter(
        u => u.username === selectedConsumer
    );

    filteredUsers.forEach((user, index) => {
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

        // ✅ ✅ ONLY CHANGE: bar size styling
        datasets.push({
            label: user.username,
            data: [],
            meta: deviceMap,
            backgroundColor: colors[index % colors.length],
            barThickness: 16,
            maxBarThickness: 18,
            borderRadius: 6
        });
    });

    const labels = Array.from(deviceSet);
    datasets.forEach(ds => {
        ds.data = labels.map(label => ds.meta[label]?.units ?? 0);
    });

    const reportChartData = { labels, datasets };

    // ✅ ✅ ONLY CHANGE: chart options for compact bars
    const reportChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                categoryPercentage: 0.55,
                barPercentage: 0.55
            },
            y: {
                ticks: {
                    callback: v => `${v} units`
                }
            }
        },
        plugins: {
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
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Technician Dashboard</h2>

            {/* ================= COMPLAINTS ================= */}
            <h3>Complaints</h3>
            <table>
                <thead>
                    <tr>
                        <th>ConsumerId</th>
                        <th>ConsumerName</th>
                        <th>Device</th>
                        <th>Address</th>
                        <th>Complaint</th>
                        <th>Date</th> 
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, i) => (
                        <tr key={i}>
                            <td>{row.userId}</td>
                            <td>{row.username}</td>
                            <td>{row.deviceName}</td>
                            <td>{row.address}</td>
                            <td>{row.complaint}</td>

                            <td>
                                {row.date ? new Date(row.date).toLocaleDateString() : "N/A"}
                            </td>

                            <td>{row.status}</td>
                            <td>
                                {row.status === "Pending" && (
                                    <button onClick={() => resolveComplaint(row.userId, row.deviceId)}>
                                        Resolve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ================= ADD DEVICE ================= */}
            <h3>Add Device</h3>
            <select
                value={newDevice.userId}
                onChange={e => setNewDevice({ ...newDevice, userId: e.target.value })}
            >
                <option value="">Select User</option>
                {consumerData.map(c => (
                    <option key={c.userId} value={c.userId}>{c.userId}</option>
                ))}
            </select>

            <input
                placeholder="Device Name"
                value={newDevice.deviceName}
                onChange={e => setNewDevice({ ...newDevice, deviceName: e.target.value })}
            />

            <button onClick={addDevice}>Add</button>

            {/* ================= CONSUMER DETAILS (UNCHANGED ✅) ================= */}
            <h3>Consumer Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Consumer Name</th>
                        <th>Address</th>
                        <th>Select Device</th>
                        <th>Date</th>
                        <th>Units</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {consumerData.length === 0 ? (
                        <tr>
                            <td colSpan="7">No data available</td>
                        </tr>
                    ) : (
                        consumerData.map(c => {
                            const selected = selectedDevice[c.userId];
                            const filter = filters[c.userId] || {};

                            const matched = selected?.consumptions?.find(
                                cons =>
                                    Number(cons.month) === Number(filter.month) &&
                                    Number(cons.year) === Number(filter.year)
                            );

                            return (
                                <tr key={c.userId}>
                                    <td>{c.userId}</td>
                                    <td>{c.username}</td>
                                    <td>{c.address}</td>
                                    <td>
                                        <select
                                            value={selected?.deviceId || ""}
                                            onChange={e => {
                                                const dev = c.devices.find(
                                                    d => String(d.deviceId) === e.target.value
                                                );
                                                setSelectedDevice(prev => ({
                                                    ...prev,
                                                    [c.userId]: dev
                                                }));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {c.devices.map(d => (
                                                <option key={d.deviceId} value={d.deviceId}>
                                                    {d.deviceName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="month"
                                            onChange={e => {
                                                const [year, month] = e.target.value.split("-");
                                                setFilters(prev => ({
                                                    ...prev,
                                                    [c.userId]: { year, month }
                                                }));
                                            }}
                                        />
                                    </td>
                                    <td>{matched ? matched.units : "-"}</td>
                                    <td>{matched ? matched.cost : "-"}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* ================= REPORTS ================= */}
            <h3>Reports</h3>
            <select
                value={selectedConsumer}
                onChange={e => setSelectedConsumer(e.target.value)}
            >
                <option value="">Select Consumer</option>
                {reportUsers.map(u => (
                    <option key={u.userId} value={u.username}>{u.username}</option>
                ))}
            </select>

            {selectedConsumer && (
                <div
                    className="chart-container"
                    style={{ maxWidth: "650px", height: "280px", margin: "20px auto" }}
                >
                    <Bar data={reportChartData} options={reportChartOptions} />
                </div>
            )}
        </div>
    );
}

export default TechnicianDashboard;