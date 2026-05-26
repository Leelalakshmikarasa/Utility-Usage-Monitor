import React, { useState } from "react";
import api from "../../../../api";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

function UserProfile({ user, setUser, userId }) {

    const [editMode, setEditMode] = useState(false);

    const [editData, setEditData] = useState({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address
    });

    const saveProfile = async () => {
        const res = await api.put(`/user/${userId}`, editData);
        setUser(res.data);
        setEditMode(false);
    };

    return (
        <div className="profile-container">

            {/* ✅ AVATAR SECTION */}
            <div className="profile-header">
                <div className="avatar">
                    {user.username?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2>{user.username}</h2>
                    <p className="sub-text">{user.email}</p>
                </div>
            </div>

            {/* ✅ DETAILS CARD */}
            <div className="profile-details">

                <div className="detail-row">
                    <FaUser /> <span><b>User ID:</b> {user.userId}</span>
                </div>

                <div className="detail-row">
                    <FaPhone /> <span>{user.phoneNumber}</span>
                </div>

                <div className="detail-row">
                    <FaMapMarkerAlt /> <span>{user.address}</span>
                </div>

                {!editMode && (
                    <button className="edit-btn" onClick={() => setEditMode(true)}>
                        <FaEdit /> Edit Profile
                    </button>
                )}

            </div>

            {/* ✅ EDIT FORM */}
            {editMode && (
                <div className="edit-form">

                    <input
                        value={editData.username}
                        onChange={e => setEditData({ ...editData, username: e.target.value })}
                    />

                    <input value={editData.email} disabled />

                    <input
                        value={editData.phoneNumber}
                        onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })}
                    />

                    <input
                        value={editData.address}
                        onChange={e => setEditData({ ...editData, address: e.target.value })}
                    />

                    <div className="btn-group">
                        <button onClick={saveProfile}>Save</button>
                        <button onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;