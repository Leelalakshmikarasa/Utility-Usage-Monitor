import { useState } from "react";

function AddDevice({ consumers, onAdd }) {

    const [userId, setUserId] = useState("");
    const [deviceName, setDeviceName] = useState("");

    const submit = () => {
        if (!userId || !deviceName) return;
        onAdd({ userId, deviceName });
        setUserId("");
        setDeviceName("");
    };

    return (
        <div className="section-card">

            <h3>Add Device</h3>

            <div className="form-grid">
                <select value={userId} onChange={e => setUserId(e.target.value)}>
                    <option value="">Select User</option>
                    {consumers.map(c => (
                        <option key={c.userId} value={c.userId}>{c.userId}</option>
                    ))}
                </select>

                <input
                    placeholder="Device Name"
                    value={deviceName}
                    onChange={e => setDeviceName(e.target.value)}
                />

                <button className="submit-btn" onClick={submit}>
                    Add Device
                </button>
            </div>

        </div>
    );
}

export default AddDevice;