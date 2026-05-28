import React, { useState } from "react";

import api from "../../../../api";

function AddComplaint({ userId, devices, setComplaints }) {

    const [deviceId, setDeviceId] = useState("");

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [date, setDate] = useState("");

    const submit = async () => {

        if (!deviceId || !title || !description || !date) {

            alert("Please fill all fields");

            return;

        }

        try {

            await api.post(`/user/${userId}/complaint`, {

                deviceId: Number(deviceId),

                title,

                description,

                date

            });

            const res = await api.get(`/user/${userId}/complaints`);

            setComplaints(res.data || []);

            alert("Complaint submitted successfully!");

        } catch (err) {

            console.error(err);

            alert("Error submitting complaint");

        }

    };

    return (
        <div className="add-complaint-overlay">

            <div className="add-complaint-card">

                <h2>Add Complaint</h2>
                <p className="sub-text">Tell us your issue and we will resolve it</p>

                <div className="form-grid">

                    <select value={deviceId} onChange={e => setDeviceId(e.target.value)}>
                        <option value="">Select Device</option>

                        {devices.map(d => (
                            <option key={d.id} value={d.id}>

                                {d.deviceName}
                            </option>

                        ))}
                    </select>

                    <input

                        type="date"

                        value={date}

                        onChange={e => setDate(e.target.value)}

                    />

                    <input

                        placeholder="Complaint Title"

                        value={title}

                        onChange={e => setTitle(e.target.value)}

                    />

                    <textarea

                        placeholder="Describe your issue..."

                        value={description}

                        onChange={e => setDescription(e.target.value)}

                        className="full-width"

                    />

                    <button className="submit-btn" onClick={submit}>

                        Submit Complaint
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AddComplaint;
