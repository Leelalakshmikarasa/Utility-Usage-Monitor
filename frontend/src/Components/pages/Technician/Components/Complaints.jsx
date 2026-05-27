function Complaints({ data = [], onResolve }) {
    return (
        <div className="section-card">

            <h3>Complaints</h3>

            <table>
                <thead>
                    <tr>
                        <th>Consumer Id</th>
                        <th>Consumer Name</th>
                        <th>Device</th>
                        <th>Address</th>
                        <th>Complaint</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="8">No complaints available</td>
                        </tr>
                    ) : (
                        data.map((c, i) => (
                            <tr key={i}>
                                {/* ✅ All fields restored */}
                                <td>{c.userId}</td>
                                <td>{c.username}</td>
                                <td>{c.deviceName}</td>
                                <td>{c.address}</td>
                                <td>{c.complaint}</td>

                                {/* ✅ Date handling */}
                                <td>
                                    {c.date
                                        ? new Date(c.date).toLocaleDateString()
                                        : "N/A"}
                                </td>

                                <td>{c.status}</td>

                                {/* ✅ Action */}
                                <td>
                                    {c.status === "Pending" && (
                                        <button
                                            onClick={() =>
                                                onResolve(c.userId, c.deviceId)
                                            }
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default Complaints;