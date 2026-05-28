import { useState, useRef } from "react";

function ConsumerDetails({ data = [] }) {
    const [selectedDevice, setSelectedDevice] = useState({});
    const [filters, setFilters] = useState({});
    const monthRefs = useRef({});

    return (
        <div className="consumer-page">

            <div className="consumer-header">
                <h2>Consumer Usage Lookup</h2>
                <p>Select a device and month to view usage and cost</p>
            </div>

            <div className="consumer-list">
                {data.map((c) => {
                    const selected = selectedDevice[c.userId];
                    const filter = filters[c.userId] || {};

                    /* ✅ RESTORED MATCH LOGIC */
                    const matched = selected?.consumptions?.find(
                        (cons) =>
                            Number(cons.month) === Number(filter.month) &&
                            Number(cons.year) === Number(filter.year)
                    );

                    return (
                        <div
                            className={`consumer-card ${!filter.year ? "has-helper" : ""}`}
                            key={c.userId}
                        >
                            

                            {/* LEFT */}
                            <div className="consumer-left">
                                <div className="avatar-circle">
                                    {c.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <strong>{c.username}</strong>
                                    <p>{c.address}</p>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="consumer-actions">

                                <select
                                    value={selected?.deviceId || ""}
                                    onChange={(e) => {
                                        const dev = c.devices.find(
                                            d => String(d.deviceId) === e.target.value
                                        );
                                        setSelectedDevice(prev => ({
                                            ...prev,
                                            [c.userId]: dev
                                        }));
                                    }}
                                >
                                    <option value="">Select Device</option>
                                    {c.devices?.map(d => (
                                        <option key={d.deviceId} value={d.deviceId}>
                                            {d.deviceName}
                                        </option>
                                    ))}
                                </select>

                                {/* MONTH FIELD */}
                                <div className="month-field">

                                    <div className="month-input-wrapper">
                                        <input
                                            type="month"
                                            ref={(el) => (monthRefs.current[c.userId] = el)}
                                            value={
                                                filter.year
                                                    ? `${filter.year}-${String(filter.month).padStart(2, "0")}`
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const [year, month] = e.target.value.split("-");
                                                setFilters(prev => ({
                                                    ...prev,
                                                    [c.userId]: { year, month }
                                                }));
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="month-btn"
                                            onClick={() => monthRefs.current[c.userId]?.showPicker()}
                                        >
                                            📅
                                        </button>
                                    </div>

                                    {!filter.year && (
                                        <span className="month-helper">Select date</span>
                                    )}
                                </div>

                            </div>

                            {/* ✅ RESULT (NOW DATA WILL APPEAR) */}
                            <div className="consumer-result">
                                <div>
                                    <span>Units</span>
                                    <strong>
                                        {matched ? `${matched.units} kWh` : "0 kWh"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Cost</span>
                                    <strong>
                                        {matched ? `₹${matched.cost}` : "₹0"}
                                    </strong>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ConsumerDetails;
