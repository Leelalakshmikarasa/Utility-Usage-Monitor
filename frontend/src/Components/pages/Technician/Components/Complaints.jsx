import React, { useState } from "react";
function Complaints({ data = [], onResolve }) {

    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const resolvedCount = data.filter(c => c.status === "Resolved").length;
    const pendingCount = data.filter(c => c.status === "Pending").length;
    const totalCount = data.length;

    const styles = {
        page: {
            background: "#020617",
            color: "#e5e7eb",
            padding: "25px",
            minHeight: "100vh",
            fontFamily: "sans-serif"
        },
        cards: {
            display: "flex",
            gap: "20px",
            marginTop: "20px"
        },
        card: {
            flex: 1,
            background: "linear-gradient(145deg, #0f172a, #1e293b)",
            borderRadius: "16px",
            padding: "20px"
        },
        tableContainer: {
            marginTop: "25px",
            background: "#0f172a",
            borderRadius: "15px",
            padding: "15px"
        },
        tableHeader: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "70px 140px 1fr 120px 120px 120px",
            alignItems: "center",
            padding: "10px"
        },
        headerRow: {
            color: "#64748b",
            fontWeight: "bold",
            borderBottom: "1px solid #1e293b"
        },
        row: {
            borderBottom: "1px solid #1e293b"
        },
        badge: {
            padding: "5px 12px",
            borderRadius: "12px",
            fontSize: "13px"
        },
        btn: {
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
        },

        /* ✅ POPUP STYLES */overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        },
        modal: {
            background: "#0f172a",
            padding: "25px",
            borderRadius: "12px",
            width: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }
    };

    return (
        <div style={styles.page}>{/* HEADER */}<div><h1 style={{ fontSize: "26px" }}>Complaint Management</h1><p style={{ color: "#94a3b8" }}>{totalCount} total complaints · {resolvedCount} resolved · {pendingCount} pending
        </p></div>{/* CARDS */}<div style={styles.cards}><div style={styles.card}><h2>{totalCount}</h2><p style={{ color: "#94a3b8" }}>Total Complaints</p></div><div style={styles.card}><h2>{pendingCount}</h2><p style={{ color: "#94a3b8" }}>Pending</p></div><div style={styles.card}><h2>{resolvedCount}</h2><p style={{ color: "#94a3b8" }}>Resolved</p></div></div>{/* TABLE */}<div style={styles.tableContainer}><div style={styles.tableHeader}><h3>All Complaints</h3></div><div style={{ ...styles.grid, ...styles.headerRow }}><div>ID</div><div>Consumer</div><div>Issue</div><div>Device</div><div>Status</div><div>Action</div></div>{data.map((c, i) => (<div key={i} style={{ ...styles.grid, ...styles.row }}><div>#{String(i + 1).padStart(3, "0")}</div><div>{c.username}</div><div>{c.complaint}</div><div>{c.deviceName || c.deviceId}</div><div><span style={{ ...styles.badge, background: c.status === "Resolved" ? "#064e3b" : "#7c2d12", color: c.status === "Resolved" ? "#34d399" : "#f97316" }}>{c.status}</span></div><div>{c.status === "Pending" ? (<button
            style={{ ...styles.btn, background: "#2563eb", color: "white" }} onClick={() => onResolve(c.userId, c.deviceId)}>                                    Resolve
        </button>) : (<button
            style={{ ...styles.btn, background: "#1d4ed8", color: "white" }} onClick={() => setSelectedComplaint(c)}>                                    View
        </button>)}</div></div>))}</div>{/* ✅ POPUP MODAL */}{selectedComplaint && (<div style={styles.overlay}><div style={styles.modal}><h2 style={{ marginBottom: "15px" }}>Complaint Details</h2><p><strong>Consumer:</strong> {selectedComplaint.username}</p><p><strong>Issue:</strong> {selectedComplaint.complaint}</p><p><strong>Device:</strong> {selectedComplaint.deviceName || selectedComplaint.deviceId}</p><p><strong>Status:</strong> {selectedComplaint.status}</p><p>
            <strong>Description:</strong>
            <div style={{ marginTop: "5px", color: "#cbd5f5" }}>
                {selectedComplaint.description || "No description provided"}
            </div>
        </p>
<button
            style={{ marginTop: "15px", padding: "8px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px" }} onClick={() => setSelectedComplaint(null)}>                            Close
        </button></div></div>)}</div>);
}
export default Complaints;
