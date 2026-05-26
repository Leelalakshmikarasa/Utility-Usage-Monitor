function TechnicianOverview({ technicians }) {
    return (
        <div className="section-card">
            <h3>Technicians Overview</h3>

            <table>
                <thead>
                    <tr>
                        <th>Technician</th>
                        <th>Area</th>
                        <th>Consumers</th>
                        <th>Total</th>
                        <th>Pending</th>
                        <th>Resolved</th>
                    </tr>
                </thead>

                <tbody>
                    {technicians.length === 0 ? (
                        <tr>
                            <td colSpan="6">No data available</td>
                        </tr>
                    ) : (
                        technicians.map((t, i) => (
                            <tr key={i}>
                                <td>{t.username}</td>
                                <td>{t.address}</td>
                                <td>{t.consumersCount}</td>
                                <td>{t.totalComplaints}</td>
                                <td className="warning">{t.pendingComplaints}</td>
                                <td className="success">{t.resolvedComplaints}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TechnicianOverview;