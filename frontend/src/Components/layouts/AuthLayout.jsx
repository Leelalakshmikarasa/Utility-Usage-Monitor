import React from "react";
import "../styles/AppLayout.css";

function AppLayout({ title, children }) {
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{title}</h2>
                {children}
            </div>

            {/* Right side – same visual panel */}
            <div className="graph-section">
                <h2>Utility Usage Monitor</h2>
                <p>Manage and monitor electricity usage smartly.</p>
            </div>
        </div>
    );
}

export default AppLayout;
