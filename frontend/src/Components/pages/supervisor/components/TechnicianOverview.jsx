function TechnicianOverview({ technicians }) {
    return (
        <div className="section-card tech-container">

            <h3 className="tech-title">Technicians Overview</h3>

            {technicians.length === 0 ? (
                <p className="no-data">No technicians available</p>
            ) : (
                <div className="tech-list">

                    {technicians.map((t, i) => (
                        <div className="tech-card" key={i}>

                            {/* LEFT SIDE */}
                            <div className="tech-left">
                                <div className="avatar-circle">
                                    {t.username?.[0]?.toUpperCase()}
                                </div>

                                <div className="tech-info">
                                    <strong>{t.username}</strong>
                                    <p>{t.address}</p>
                                </div>
                            </div>

                            {/* RIGHT SIDE STATS */}
                            <div className="tech-stats">

                                <div>
                                    <span className="label">Consumers</span>
                                    <strong>{t.consumersCount}</strong>
                                </div>

                                <div>
                                    <span className="label">Total Complaints</span>
                                    <strong>{t.totalComplaints}</strong>
                                </div>

                                <div>
                                    <span className="label">Pending</span>
                                    <strong className="pending">
                                        {t.pendingComplaints}
                                    </strong>
                                </div>

                                <div>
                                    <span className="label">Resolved</span>
                                    <strong className="success">
                                        {t.resolvedComplaints}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default TechnicianOverview;