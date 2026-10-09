import React, { useEffect, useState } from "react";
import { fetchFreelancerOrders } from "../services/api";

export default function FreelancerEarnings() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchFreelancerOrders().then((data) => {
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    });
  }, []);

  const totalEarnings = orders.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const paid = orders.filter((item) => String(item.status || "").toUpperCase() === "COMPLETED").reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const pending = orders.filter((item) => String(item.status || "").toUpperCase() === "PENDING").reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Earnings</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", flex: "1 1 200px" }}>
          <h3>Total Earnings</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${totalEarnings.toFixed(2)}</p>
        </div>
        <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", flex: "1 1 200px" }}>
          <h3>Paid</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${paid.toFixed(2)}</p>
        </div>
        <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", flex: "1 1 200px" }}>
          <h3>Pending</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${pending.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Order</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Client</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "1rem" }}>No earnings data yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem" }}>{order.gigTitle || "Gig"}</td>
                  <td style={{ padding: "0.75rem" }}>{order.clientName || "Client"}</td>
                  <td style={{ padding: "0.75rem" }}>${Number(order.price || 0).toFixed(2)}</td>
                  <td style={{ padding: "0.75rem" }}>{order.status || "Pending"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Reference List
React, 2026. Built-in React Hooks. [online] Available at: <https://react.dev/reference/react/hooks> [Accessed 10 October 2026].
MDN Web Docs, 2026. Array.prototype.reduce(). [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce> [Accessed 10 October 2026].
MDN Web Docs, 2026. Array.prototype.filter(). [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter> [Accessed 10 October 2026].
*/
