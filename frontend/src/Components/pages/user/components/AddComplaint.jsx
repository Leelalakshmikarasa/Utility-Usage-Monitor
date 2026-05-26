import React, { useState } from "react";
import api from "../../../../api";

function AddComplaint({ userId, devices, setComplaints }) {

    const [deviceId, setDeviceId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [success, setSuccess] = useState(false); // ✅ popup state

    const submit = async () => {
        if (!deviceId || !title || !description || !date) {
            alert("Please fill all fields");
            return;
        }

        await api.post(`/user/${userId}/complaint`, {
            deviceId: Number(deviceId),
            title,
            description,
            date
        });

        const res = await api.get(`/user/${userId}/complaints`);
        setComplaints(res.data || []);

        // ✅ reset
        setTitle("");
        setDescription("");
        setDate("");

        // ✅ show popup
        setSuccess(true);

        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="section-card">

            <h3>Add Complaint</h3>

            {/* ✅ FORM GRID */}
            <div className="form-grid">

                <select value={deviceId} onChange={e => setDeviceId(e.target.value)}>
                    <option value="">Select Device</option>
                    {devices.map(d => (
                        <option key={d.id} value={d.id}>{d.deviceName}</option>
                    ))}
                </select>

                <input type="date" value={date} onChange={e => setDate(e.target.value)} />

                <input
                    placeholder="Complaint Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                {/* ✅ FULL WIDTH TEXTAREA */}
                <textarea
                    placeholder="Describe your issue..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="full-width"
                />

                {/* ✅ BUTTON */}
                <button className="submit-btn" onClick={submit}>
                    Submit
                </button>

            </div>

            {/* ✅ SUCCESS POPUP */}
            {success && (
                <div className="success-popup">
                    ✅ Complaint submitted successfully! We will resolve it soon.
                </div>
            )}

        </div>
    );
}

export default AddComplaint;