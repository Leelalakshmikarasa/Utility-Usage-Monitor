import React, { useEffect, useState } from "react";
import api from "../../../api";
import DashboardLayout from "../../layouts/DashboardLayout";

import UserProfile from "./components/UserProfile";
import DeviceUsage from "./components/DeviceUsage";
import MyComplaints from "./components/MyComplaints";
import AddComplaint from "./components/AddComplaint";

function UserDashboard() {
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const userId = payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const [section, setSection] = useState("profile");
    const [user, setUser] = useState(null);
    const [devices, setDevices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [consumption, setConsumption] = useState([]);

    useEffect(() => {
        const load = async () => {
            setUser((await api.get(`/user/${userId}`)).data);
            setDevices((await api.get(`/user/${userId}/devices`)).data || []);
            setComplaints((await api.get(`/user/${userId}/complaints`)).data || []);
            const c = await api.get(`/user/${userId}/consumption`);
            setConsumption(Array.isArray(c.data) ? c.data : c.data.consumptions || []);
        };
        if (userId) load();
    }, [userId]);

    const menuItems = [
        { key: "profile", label: "Profile", icon: "👤", onClick: () => setSection("profile") },
        { key: "usage", label: "Device Usage", icon: "📊", onClick: () => setSection("usage") },
        { key: "complaints", label: "My Complaints", icon: "📄", onClick: () => setSection("complaints") },
        { key: "add", label: "Add Complaint", icon: "➕", onClick: () => setSection("add") }
    ];

    if (!user) return <p>Loading...</p>;

    return (
        <DashboardLayout menuItems={menuItems}>
            {section === "profile" && <UserProfile user={user} setUser={setUser} userId={userId} />}
            {section === "usage" && (
                <DeviceUsage
                    userId={userId}   // ✅ PASS THIS
                    devices={devices}
                />
            )}
           
            {section === "complaints" && (
                <MyComplaints
                    complaints={complaints}
                    devices={devices}
                    onNewComplaint={() => setSection("add")}   // ✅ KEY LINE
                />
            )}
            {section === "add" && <AddComplaint userId={userId} devices={devices} setComplaints={setComplaints} />}
        </DashboardLayout>
    );
}

export default UserDashboard;