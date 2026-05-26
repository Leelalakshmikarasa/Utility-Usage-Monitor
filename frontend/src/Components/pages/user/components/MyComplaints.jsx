function MyComplaints({ complaints, devices }) {
    return (
        <div className="section-card">
            <h3>My Complaints</h3>

            <table>
                <thead>
                    <tr>
                        <th>Device</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((c, i) => (
                        <tr key={i}>
                            <td>{devices.find(d => d.id === c.deviceId)?.deviceName}</td>
                            <td>{c.title}</td>
                            <td>{c.status}</td>
                            <td>{new Date(c.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyComplaints;