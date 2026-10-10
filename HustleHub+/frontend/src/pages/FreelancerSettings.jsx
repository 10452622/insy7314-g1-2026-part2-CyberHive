import React, { useState } from 'react';

export default function FreelancerSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [tfaEnabled, setTfaEnabled] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setSuccessMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
    };

    return (
        <div className="freelancer-dashboard">
            <div className="freelancer-dashboard-content">
                <div className="freelancer-welcome">
                    <p className="freelancer-eyebrow">Security</p>
                    <h1>Profile / Security</h1>
                    <p>Update your password regularly[cite: 1].</p>
                </div>

                {successMessage && <div style={{ marginBottom: '15px', color: '#3f8157', fontSize: '0.82rem', fontWeight: '650' }}>{successMessage}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
                    {/* Settings Navigation Sidebar */}
                    <div className="freelancer-panel" style={{ height: 'fit-content' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                            <li><a href="#profile" style={{ color: '#626b7b', textDecoration: 'none' }}>Profile</a></li>
                            <li><a href="#account" style={{ color: '#626b7b', textDecoration: 'none' }}>Account Settings</a></li>
                            <li><a href="#security" style={{ color: 'var(--fd-violet)', fontWeight: '700', textDecoration: 'none' }}>Security</a></li>
                            <li><a href="#notifications" style={{ color: '#626b7b', textDecoration: 'none' }}>Notifications</a></li>
                            <li><a href="#payments" style={{ color: '#626b7b', textDecoration: 'none' }}>Payment Methods</a></li>
                            <li><a href="#help" style={{ color: '#626b7b', textDecoration: 'none' }}>Help & Support</a></li>
                            <li><a href="#logout" style={{ color: '#a33d39', textDecoration: 'none' }}>Logout</a></li>
                        </ul>
                    </div>

                    {/* Security Main Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="freelancer-panel">
                            <h2>Change Password</h2>
                            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#778092', marginBottom: '5px' }}>Current Password</label>
                                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--fd-border)', borderRadius: '6px', fontSize: '0.78rem' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#778092', marginBottom: '5px' }}>New Password</label>
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--fd-border)', borderRadius: '6px', fontSize: '0.78rem' }} required />
                                </div>
                                <button type="submit" style={{ background: 'var(--fd-violet)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '650', cursor: 'pointer', alignSelf: 'flex-start' }}>Change Password</button>
                            </form>
                        </div>

                        <div className="freelancer-panel">
                            <h2>Two-Factor Authentication</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                <div>
                                    <p style={{ margin: '0 0 3px', fontWeight: '650', fontSize: '0.78rem' }}>Add an extra layer of security to your account.</p>
                                    <span style={{ fontSize: '0.68rem', color: '#778092' }}>Protect your account with SMS or Authenticator App.</span>
                                </div>
                                <button onClick={() => setTfaEnabled(!tfaEnabled)} style={{ background: tfaEnabled ? '#5d9b71' : '#e8eaf0', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '650', cursor: 'pointer' }}>
                                    {tfaEnabled ? 'Enabled' : 'Disabled'}
                                </button>
                            </div>
                        </div>

                        <div className="freelancer-panel">
                            <div className="freelancer-panel-heading">
                                <h2>Login Activity</h2>
                                <a href="#view-all">View Activity</a>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#778092', margin: '5px 0 15px' }}>View your recent login activity[cite: 1].</p>
                            <div className="freelancer-table-wrap">
                                <table className="freelancer-orders-table">
                                    <thead>
                                        <tr>
                                            <th>Browser / Device</th>
                                            <th>IP Address</th>
                                            <th>Location</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Chrome on Windows</td>
                                            <td>192.168.1.10</td>
                                            <td>London, UK</td>
                                            <td>Today, 02:15 PM</td>
                                        </tr>
                                        <tr>
                                            <td>Safari on iPhone</td>
                                            <td>192.168.1.15</td>
                                            <td>London, UK</td>
                                            <td>Yesterday, 09:40 AM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}