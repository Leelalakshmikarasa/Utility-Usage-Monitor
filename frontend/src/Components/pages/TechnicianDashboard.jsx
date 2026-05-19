import React, { useEffect, useState } from "react";
import api from "../../api";

function TechnicianDashboard() {
    const [tableData, setTableData] = useState([]);

    // ✅ states
    const [reportUsers, setReportUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [showResult, setShowResult] = useState(false);

    // ✅ useEffect (fixed)
    useEffect(() => {
        loadTableData();
        loadReportUsers();
    }, []);

    // ✅ MAIN TABLE
    const loadTableData = async () => {
        const conRes = await api.get("/technician/consumers");
        const compRes = await api.get("/technician/complaints");
        const consRes = await api.get("/technician/consumptions");
        const devRes = await api.get("/technician/device");

        const users = conRes.data;
        const complaints = compRes.data;
        const consumptions = consRes.data;
        const devices = devRes.data;

        const merged = users.map((u) => {
            const device = devices.find((d) => d.userId === u.userId);
            const consumption = consumptions.find((c) => c.userId === u.userId);
            const complaint = complaints.find((c) => c.userId === u.userId);

            return {
                userId: u.userId,
                deviceId: device?.id || "-",
                address: u.address,
                units: consumption?.units || 0,
                cost: consumption?.cost || 0,
                complaint: complaint?.description || "No complaint",
                status: complaint?.status || "No complaint"
            };
        });

        setTableData(merged);
    };

    // ✅ LOAD DROPDOWN
    const loadReportUsers = async () => {
        const res = await api.get("/technician/report/user-device-month");
        setReportUsers(res.data.users || []);
    };

    // ✅ BUTTON CLICK
    const handleGetReport = () => {
        if (!selectedUser) {
            alert("Please select a consumer");
            return;
        }
        setShowResult(true);
    };

    // ✅ FIND SELECTED DATA
    const selectedData = reportUsers.find(
        (u) => u.userId === selectedUser
    );

    return (
        <div>
            <h2>Technician Dashboard</h2>

            {/* ✅ MAIN TABLE */}
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
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ REPORT */}
            <h3 style={{ marginTop: "25px" }}>Highest Usage Report</h3>

            {/* ✅ SELECT */}
            <select
                value={selectedUser}
                onChange={(e) => {
                    setSelectedUser(e.target.value);
                    setShowResult(false);
                }}
            >
                <option value="">Select Consumer</option>
                {reportUsers.map((u) => (
                    <option key={u.userId} value={u.userId}>
                        {u.userId}
                    </option>
                ))}
            </select>

            {/* ✅ BUTTON */}
            <button onClick={handleGetReport} style={{ marginLeft: "10px" }}>
                Get Report
            </button>

            {/* ✅ RESULT TABLE */}
            {showResult && selectedData && (
                <table border="1" cellPadding="8" style={{ marginTop: "15px" }}>
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
                        {(selectedData.devices || []).map((d, i) => (
                            <tr key={i}>
                                <td>{selectedData.userId}</td>
                                <td>{d.deviceName}</td>
                                <td>{d.highestConsumptionMonth?.month}</td>
                                <td>{d.highestConsumptionMonth?.year}</td>
                                <td>{d.highestConsumptionMonth?.totalUnits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ✅ IMPORTANT: export MUST be outside function
export default TechnicianDashboard;