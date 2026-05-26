import React from "react";
import Sidebar from "../common/Sidebar";
import "./AppLayout.css";

function DashboardLayout({ menuItems, children }) {
    return (
        <div className="dashboard-layout">
            <Sidebar menuItems={menuItems} />

            <div className="dashboard-content">
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;