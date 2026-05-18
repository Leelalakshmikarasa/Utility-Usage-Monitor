import React, { useEffect, useState } from "react";
import API from "../../api";

function SupervisorDashboard() {
    const [technicians, setTechnicians] = useState([]);
    const [consumptions, setConsumptions] = useState([]);

    useEffect(() => {
        fetchTechnicians();
        fetchConsumptions();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const res = await API.get("/supervisor/technicians");

            // ✅ SAFETY CHECK
            setTechnicians(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setTechnicians([]);
        }
    };

    const fetchConsumptions = async () => {
        try {
            const res = await API.get("/supervisor/consumptions/by-address");

            setConsumptions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setConsumptions([]);
        }
    };

    return (
        <div>
            <h2>Supervisor Dashboard</h2>

            {/* ✅ TECHNICIANS TABLE */}
            <h3>Technicians Overview</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Technician</th>
                        <th>Area</th>
                        <th>Consumers</th>
                        <th>Total Complaints</th>
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
                            <td>{t.pendingComplaints}</td>
                            <td>{t.resolvedComplaints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />

            {/* ✅ CONSUMPTION BY ADDRESS */}
            <h3>Consumption by Address</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Total Usage</th>
                    </tr>
                </thead>
                <tbody>
                    {consumptions.map((c, i) => (
                        <tr key={i}>
                            <td>{c.address}</td>
                            <td>{c.totalUsage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SupervisorDashboard;