import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../../api";

import TechnicianOverview from "./components/TechnicianOverview";
import ConsumptionReport from "./components/ConsumptionReport";
import DashboardOverview from "./components/DashboardOverview";

function SupervisorDashboard() {

    const [section, setSection] = useState("overview");
    const [technicians, setTechnicians] = useState([]);
    const [consumptions, setConsumptions] = useState([]);

    useEffect(() => {
        loadTechnicians();
        loadConsumptions();
    }, []);

    const loadTechnicians = async () => {
        try {
            const res = await api.get("/supervisor/technicians");
            setTechnicians(res.data || []);
        } catch {
            setTechnicians([]);
        }
    };

    const loadConsumptions = async () => {
        try {
            const res = await api.get("/supervisor/consumptions/by-address");
            setConsumptions(res.data || []);
        } catch {
            setConsumptions([]);
        }
    };


    const menuItems = [
        { key: "overview", label: "Overview", icon: "📊", onClick: () => setSection("overview") },
        { key: "technicians", label: "Technicians", icon: "👨‍🔧", onClick: () => setSection("technicians") },
        { key: "reports", label: "Reports", icon: "📊", onClick: () => setSection("reports") }
    ];


    return (
        <DashboardLayout menuItems={menuItems}>
            {section === "overview" && (
                <DashboardOverview
                    technicians={technicians}
                    consumptions={consumptions}
                    setSection={setSection}  // ✅ THIS LINE FIXES ERROR
                />
            )}

            {section === "technicians" && (
                <TechnicianOverview technicians={technicians} />
            )}

            {section === "reports" && (
                <ConsumptionReport consumptions={consumptions} />
            )}



        </DashboardLayout>
    );
}

export default SupervisorDashboard;