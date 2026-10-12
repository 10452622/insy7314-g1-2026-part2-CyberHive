import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {getMyBookings} from "../services/api";

export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [error, setError] = useState("");

    useEffect(() => {
        getMyBookings()
            .then((data) => setOrders(data.data || data || []))
            .catch((err) => setError(err.message || "Failed to fetch orders"))
            .finally(() => setLoading(false));
    }, []);

    const filteredOrders = orders.filter((order) => filter === "ALL"||  order.status === filter);
    
    if(loading) return <div>Loading orders...</div>;
    if(error) return <div>Error: {error}</div>;
    
    return (
        <div style={{ padding: "2rem" }}>
            <h2>My Orders</h2>

            <div style={{ margin: "1rem 0", display: "flex", gap: "10px" }}>
                {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            fontWeight: filter === status ? "bold" : "normal",
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.id}</td>
                            <td>{order.gig?.title || "Service"}</td>
                            <td>${order.price || order.gig?.price}</td>
                            <td>{order.status}</td>
                            <td>
                                <Link to={`/order/${order._id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}