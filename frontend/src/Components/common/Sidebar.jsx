import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ menuItems }) {
    const [active, setActive] = useState(menuItems[0].key);

    return (
        <div className="sidebar">
            <h2>Dashboard</h2>

            {menuItems.map(item => (
                <button
                    key={item.key}
                    className={active === item.key ? "active" : ""}
                    onClick={() => {
                        setActive(item.key);
                        item.onClick();
                    }}
                >
                    {item.icon} {item.label}
                </button>
            ))}
        </div>
    );
}

export default Sidebar;