import React from "react";
 
function MyComplaints({ complaints, devices, onNewComplaint }) {
 
    const total = complaints.length;

    const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;

    const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
 
    return (
<div className="complaints-container">
 
            {/* HEADER */}
<div className="complaints-header complaints-header-row">
<div className="complaints-header-left">
<h2>My Complaints</h2>
<p>{total} total · {resolved} resolved · {pending} pending</p>
</div>
 
                <button

                    className="new-complaint-btn"

                    onClick={onNewComplaint}
>

                    + New Complaint
</button>
</div>
 
            {/* STATS */}
<div className="overview-cards">
<div className="card">
<h1>{total}</h1>
<p>Total Field</p>
<span className="badge blue">All time</span>
</div>
 
                <div className="card">
<h1>{pending}</h1>
<p>Pending</p>
<span className="badge orange">Awaiting</span>
</div>
 
                <div className="card">
<h1>{resolved}</h1>
<p>Resolved</p>
<span className="badge green">✔ Done</span>
</div>
</div>
 
            {/* LIST */}
<div className="complaint-list">

                {complaints.map((c, i) => {

                    const device =

                        devices?.find(d => d.id === c.deviceId)?.deviceName || "dev";
 
                    return (
<div key={i} className="complaint-card">
<div className="complaint-left">
<div className="complaint-title">

                                    {device} — {c.title}
</div>
<div className="complaint-desc">

                                    {c.description}
</div>
<div className="complaint-date">

                                    Field: {new Date(c.date).toLocaleDateString()}
</div>
</div>
 
                            <span className={`status-badge ${(c.status || "").toLowerCase()}`}>

                                {c.status}
</span>
</div>

                    );

                })}
</div>
 
        </div>

    );

}
 
export default MyComplaints;
