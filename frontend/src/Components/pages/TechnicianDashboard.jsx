import React, { useEffect, useState } from "react";
import api from "../../api";

function TechnicianDashboard() {
    const [tableData, setTableData] = useState([]);

    // Highest usage report
    const [reportUsers, setReportUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [showReport, setShowReport] = useState(false);

    // Add device
    const [newDevice, setNewDevice] = useState({
        userId: "",
        deviceName: ""
    });

    useEffect(() => {
        loadTableData();
        loadReportUsers();
    }, []);

    // ================= MAIN TABLE =================
    const loadTableData = async () => {
        const conRes = await api.get("/technician/consumers");
        const compRes = await api.get("/technician/complaints");
        const consRes = await api.get("/technician/consumptions");
        const devRes = await api.get("/technician/device");

        const users = conRes.data;
        const complaints = compRes.data;
        const consumptions = consRes.data;
        const devices = devRes.data;

        // ✅ ONE ROW PER COMPLAINT (FIX)
        const merged = complaints.map((c) => {
            const user = users.find(u => u.userId === c.userId);
            const device = devices.find(d => d.id === c.deviceId);
            const consumption = consumptions.find(cs => cs.userId === c.userId);

            return {
                complaintId: c.id,
                userId: c.userId,
                deviceId: c.deviceId ?? "-",
                address: user?.address || "-",
                units: consumption?.units || 0,
                cost: consumption?.cost || 0,
                complaint: c.description,
                status: c.status
            };
        });

        setTableData(merged);
    };

    // ================= PUT → RESOLVE COMPLAINT =================
    const resolveComplaint = async (userId, deviceId) => {
        try {
            await api.put(`/technician/resolve/${userId}/${deviceId}`);
            alert("Complaint resolved ✅");
            loadTableData();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Error resolving complaint ❌");
        }
    };

    // ================= POST → ADD DEVICE =================
    const addDevice = async () => {
        if (!newDevice.userId || !newDevice.deviceName) {
            alert("Enter User Id and Device Name");
            return;
        }

        try {
            await api.post("/technician/device", newDevice);
            alert("Device added ✅");
            setNewDevice({ userId: "", deviceName: "" });
            loadTableData();
        } catch {
            alert("Error adding device ❌");
        }
    };

    // ================= HIGHEST USAGE REPORT =================
    const loadReportUsers = async () => {
        const res = await api.get("/technician/report/user-device-month");
        setReportUsers(res.data.users || []);
    };

    const handleGetReport = () => {
        if (!selectedUser) {
            alert("Please select a consumer");
            return;
        }
        setShowReport(true);
    };

    return (
        <div>
            <h2>Technician Dashboard</h2>

            {/* ================= MAIN TABLE ================= */}
            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Device Id</th>
                        <th>Address</th>
                        <th>Units</th>
                        <th>Cost</th>
                        <th>Complaint</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((row, i) => (
                        <tr key={i}>
                            <td>{row.userId}</td>
                            <td>{row.deviceId}</td>
                            <td>{row.address}</td>
                            <td>{row.units}</td>
                            <td>{row.cost}</td>
                            <td>{row.complaint}</td>
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
            <h3 style={{ marginTop: "30px" }}>Add Device</h3>

            <input
                placeholder="User Id"
                value={newDevice.userId}
                onChange={(e) =>
                    setNewDevice({ ...newDevice, userId: e.target.value })
                }
            />

            <input
                placeholder="Device Name"
                value={newDevice.deviceName}
                onChange={(e) =>
                    setNewDevice({ ...newDevice, deviceName: e.target.value })
                }
            />

            <button onClick={addDevice}>Add Device</button>

            {/* ================= HIGHEST USAGE REPORT ================= */}
            <h3 style={{ marginTop: "30px" }}>Highest Usage Report</h3>

            <select
                value={selectedUser}
                onChange={(e) => {
                    setSelectedUser(e.target.value);
                    setShowReport(false);
                }}
            >
                <option value="">Select Consumer</option>
                {reportUsers.map((u) => (
                    <option key={u.userId} value={u.userId}>
                        {u.userId}
                    </option>
                ))}
            </select>

            <button onClick={handleGetReport} style={{ marginLeft: "10px" }}>
                Get Report
            </button>

            {showReport && (
                <table
                    border="1"
                    cellPadding="8"
                    style={{ marginTop: "15px" }}
                >
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>Device</th>
                            <th>Highest Month</th>
                            <th>Year</th>
                            <th>Total Units</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportUsers
                            .filter((u) => u.userId === selectedUser)
                            .flatMap((u) =>
                                (u.devices || []).map((d, i) => (
                                    <tr key={`${u.userId}-${i}`}>
                                        <td>{u.userId}</td>
                                        <td>{d.deviceName}</td>
                                        <td>{d.highestConsumptionMonth?.month}</td>
                                        <td>{d.highestConsumptionMonth?.year}</td>
                                        <td>{d.highestConsumptionMonth?.totalUnits}</td>
                                    </tr>
                                ))
                            )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TechnicianDashboard;