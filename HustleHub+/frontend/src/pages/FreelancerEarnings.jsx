import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FreelancerEarnings() {
    const [data, setData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('earnings');

    useEffect(() => {
        axios.get('/api/freelancer/earnings').then(res => setData(res.data));
        axios.get('/api/freelancer/transactions').then(res => setTransactions(res.data));
    }, []);

    return (
        <div className="freelancer-dashboard">
            <div className="freelancer-dashboard-content">
                <div className="freelancer-welcome">
                    <p className="freelancer-eyebrow">Earnings</p>
                    <h1>Track your income and performance.</h1>
                </div>

                {/* Stat Cards (Page 16)[cite: 1] */}
                <div className="freelancer-stat-grid">
                    <div className="freelancer-stat"><span className="freelancer-stat-label">Total Earnings</span><span className="freelancer-stat-value">£{data?.totalEarnings || 2500}</span></div>
                    <div className="freelancer-stat"><span className="freelancer-stat-label">This Month</span><span className="freelancer-stat-value">£{data?.currentMonthEarnings || 800}</span></div>
                    <div className="freelancer-stat"><span className="freelancer-stat-label">This Year</span><span className="freelancer-stat-value">£{data?.currentYearEarnings || 2500}</span></div>
                    <div className="freelancer-stat"><span className="freelancer-stat-label">Pending</span><span className="freelancer-stat-value">£{data?.pendingEarnings || 200}</span></div>
                </div>

                {/* Navigation Tabs for Pages 16, 17, 18 */}
                <div className="freelancer-nav" style={{ marginBottom: '20px' }}>
                    <button className={activeTab === 'earnings' ? 'active' : ''} onClick={() => setActiveTab('earnings')}>Overview</button>
                    <button className={activeTab === 'tax' ? 'active' : ''} onClick={() => setActiveTab('tax')}>Estimated Tax[cite: 1]</button>
                    <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>Transaction Records[cite: 1]</button>
                </div>

                {activeTab === 'tax' && (
                    <div className="freelancer-panel">
                        <h2>Estimated Tax Obligations</h2>
                        <p>Overview of your estimated tax based on your income[cite: 1].</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                            <div>
                                <p><strong>Total Income:</strong> £2,500[cite: 1]</p>
                                <p><strong>Estimated Tax (20%):</strong> £500[cite: 1]</p>
                                <p><strong>After Tax Income:</strong> £2,000[cite: 1]</p>
                            </div>
                            <div>
                                <p><strong>Income This Month:</strong> £800[cite: 1]</p>
                                <p><strong>Estimated Tax:</strong> £160[cite: 1]</p>
                                <p><strong>Estimated After Tax Income:</strong> £640[cite: 1]</p>
                            </div>
                        </div>
                        <small style={{ color: '#778092', display: 'block', marginTop: '15px' }}>
                            Note: These are estimated figures only and should not be considered as professional tax advice[cite: 1].
                        </small>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="freelancer-panel">
                        <h2>Transaction Records</h2>
                        <div className="freelancer-table-wrap" style={{ marginTop: '15px' }}>
                            <table className="freelancer-orders-table">
                                <thead>
                                    <tr>
                                        <th>Date[cite: 1]</th><th>Description[cite: 1]</th><th>Order ID[cite: 1]</th><th>Type[cite: 1]</th><th>Amount[cite: 1]</th><th>Status[cite: 1]</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx._id}>
                                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="freelancer-order-title">{tx.description}</td>
                                            <td>{tx.orderId}</td>
                                            <td>{tx.type}</td>
                                            <td className="freelancer-order-amount">£{tx.amount}</td>
                                            <td><span className="freelancer-status freelancer-status-completed">{tx.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}