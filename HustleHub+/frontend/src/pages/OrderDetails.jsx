import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../services/api";

export default function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        fetchOrderDetails(orderId)
            .then((data) => {
                const booking = data?.data ?? data;
                if (data?.success || booking) {
                    setOrder(booking);
                }
            })
            .catch(() => {
                navigate("/client/orders", { replace: true });
            });
    }, [navigate, orderId]);

    if (!order) return <p>Loading order details...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Order Details</h2>

            <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                <p><strong>Gig:</strong> {order.gigTitle || order.gig?.title || "Gig"}</p>
                <p><strong>Freelancer:</strong> {order.freelancerName || order.freelancer?.name || "Freelancer"}</p>
                <p><strong>Amount Paid:</strong> ${Number(order.price || 0).toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
                <button onClick={() => alert("Message feature triggered")}>Message Freelancer</button>
                {String(order.status || "").toUpperCase() === "PENDING" && (
                    <button style={{ color: "red" }}>Cancel Order</button>
                )}
            </div>
        </div>
    );
}