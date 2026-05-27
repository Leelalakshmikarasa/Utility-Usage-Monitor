import { useState } from "react";

function ConsumerDetails({ data = [] }) {
    const [selectedDevice, setSelectedDevice] = useState({});
    const [filters, setFilters] = useState({});

    return (
        <div className="section-card">
            <h3>Consumer Details</h3>

            <table>
                <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Select Device</th>
                        <th>Date</th>
                        <th>Units</th>
                        <th>Cost</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="7">No data available</td>
                        </tr>
                    ) : (
                        data.map((c) => {
                            const selected = selectedDevice[c.userId];
                            const filter = filters[c.userId] || {};

                            const matched = selected?.consumptions?.find(
                                (cons) =>
                                    Number(cons.month) === Number(filter.month) &&
                                    Number(cons.year) === Number(filter.year)
                            );

                            return (
                                <tr key={c.userId}>
                                    <td>{c.userId}</td>
                                    <td>{c.username}</td>
                                    <td>{c.address}</td>

                                    {/* ✅ DEVICE SELECT */}
                                    <td>
                                        <select
                                            value={selected?.deviceId || ""}
                                            onChange={(e) => {
                                                const dev = c.devices.find(
                                                    (d) => String(d.deviceId) === e.target.value
                                                );
                                                setSelectedDevice((prev) => ({
                                                    ...prev,
                                                    [c.userId]: dev
                                                }));
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {c.devices?.map((d) => (
                                                <option key={d.deviceId} value={d.deviceId}>
                                                    {d.deviceName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* ✅ MONTH FILTER */}
                                    <td>
                                        <input
                                            type="month"
                                            onChange={(e) => {
                                                const [year, month] = e.target.value.split("-");
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    [c.userId]: { year, month }
                                                }));
                                            }}
                                        />
                                    </td>

                                    {/* ✅ RESULT */}
                                    <td>{matched ? matched.units : "-"}</td>
                                    <td>{matched ? matched.cost : "-"}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ConsumerDetails;