import React, { useEffect, useState } from "react";
import api from "../../../api";
import DashboardLayout from "../../layouts/DashboardLayout";

import Complaints from "./Components/Complaints";
import AddDevice from "./Components/AddDevice";
import ConsumerDetails from "./Components/ConsumerDetails";
import Reports from "./Components/Reports";

function TechnicianDashboard() {

    const [section, setSection] = useState("complaints");

    const [complaints, setComplaints] = useState([]);
    const [consumers, setConsumers] = useState([]);
    const [reportUsers, setReportUsers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setComplaints((await api.get("/technician/complaints")).data || []);
        setConsumers((await api.get("/technician/consumers")).data || []);
        const report = await api.get("/technician/report/user-device-month");
        setReportUsers(report.data.users || []);
    };

    const resolveComplaint = async (userId, deviceId) => {
        await api.put(`/technician/resolve/${userId}/${deviceId}`);
        loadData();
    };

    const addDevice = async (data) => {
        await api.post("/technician/device", data);
        loadData();
    };

    const menuItems = [
        { key: "complaints", label: "Complaints", icon: "📄", onClick: () => setSection("complaints") },
        { key: "add", label: "Add Device", icon: "➕", onClick: () => setSection("add") },
        { key: "consumers", label: "Consumers", icon: "👥", onClick: () => setSection("consumers") },
        { key: "reports", label: "Reports", icon: "📊", onClick: () => setSection("reports") }
    ];

    return (
        <DashboardLayout menuItems={menuItems}>

            {/* ✅ COMPLAINTS */}
            {section === "complaints" && (
                <Complaints
                    data={complaints}
                    onResolve={resolveComplaint}
                />
            )}

            {/* ✅ ADD DEVICE */}
            {section === "add" && (
                <AddDevice
                    consumers={consumers}
                    onAdd={addDevice}
                />
            )}

            {/* ✅ CONSUMERS */}
            {section === "consumers" && (
                <ConsumerDetails data={consumers} />
            )}

            {/* ✅ REPORTS */}
            {section === "reports" && (
                <Reports reportUsers={reportUsers} />
            )}

        </DashboardLayout>
    );
}

export default TechnicianDashboard;