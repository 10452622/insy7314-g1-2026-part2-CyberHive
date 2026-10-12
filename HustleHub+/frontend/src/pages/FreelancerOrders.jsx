import React, { useEffect, useState } from "react";
import FreelancerHeader from "../components/FreelancerHeader";
import { fetchFreelancerOrders, updateOrderStatus } from "../services/api";
import "../styles/FreelancerDashboard.css";
import "../styles/FreelancerManagement.css";

const orderStatuses = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const currency = (amount) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(amount) || 0);

export default function FreelancerOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All Orders");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setError("");
    try {
      const result = await fetchFreelancerOrders();
      setOrders(Array.isArray(result.bookings) ? result.bookings : []);
    } catch (loadError) {
      setError(loadError.message || "Order history could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filterOptions = ["All Orders", "Pending", "In Progress", "Completed"];
  const visibleOrders = filter === "All Orders" ? orders : orders.filter((order) => order.status === filter);

  const changeStatus = async (order, status) => {
    setUpdatingId(order._id);
    setError("");
    try {
      await updateOrderStatus(order._id, status);
      await loadOrders();
    } catch (updateError) {
      setError(updateError.message || "Order status could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="freelancer-dashboard freelancer-management">
      <FreelancerHeader />
      <div className="freelancer-dashboard-content">
        <div className="management-page-heading">
          <div>
            <h1>Order History</h1>
            <p>Review and manage bookings made for your gigs.</p>
          </div>
          <span className="management-order-count">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
        </div>

        {error && <p className="management-error" role="alert">{error}</p>}

        <div className="management-tabs order-filter-tabs" role="tablist" aria-label="Filter order history">
          {filterOptions.map((option) => (
            <button key={option} type="button" role="tab" aria-selected={filter === option} className={filter === option ? "management-tab is-selected" : "management-tab"} onClick={() => setFilter(option)}>
              {option}{option === "All Orders" ? <span>{orders.length}</span> : <span>{orders.filter((order) => order.status === option).length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="management-empty">Loading order history…</div>
        ) : visibleOrders.length === 0 ? (
          <div className="management-empty"><h2>{filter === "All Orders" ? "No client bookings yet" : `No ${filter.toLowerCase()} orders`}</h2><p>Bookings for your gigs will appear here when clients place an order.</p></div>
        ) : (
          <div className="management-table-wrap">
            <table className="management-table order-history-table">
              <thead>
                <tr><th>Order</th><th>Client</th><th>Gig</th><th>Booked</th><th>Delivery</th><th>Amount</th><th>Status</th><th>Update</th></tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="management-id-cell">#{String(order._id).slice(-6).toUpperCase()}</td>
                    <td className="management-title-cell">{order.clientName || "Client"}</td>
                    <td>{order.gig?.title || "Service booking"}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
                    <td>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—"}</td>
                    <td>{currency(order.amount)}</td>
                    <td><span className={`management-status status-${String(order.status || "pending").toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span></td>
                    <td>
                      <select className="management-status-select" aria-label={`Update status for order ${String(order._id).slice(-6)}`} value={order.status} disabled={updatingId === order._id} onChange={(event) => changeStatus(order, event.target.value)}>
                        {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

/* Reference List
React, 2026. Built-in React Hooks. [online] Available at: <https://react.dev/reference/react/hooks> [Accessed 10 October 2026].
MDN Web Docs, 2026. HTMLSelectElement. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement> [Accessed 10 October 2026].
MDN Web Docs, 2026. Date.prototype.toLocaleDateString(). [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString> [Accessed 10 October 2026].
MDN Web Docs, 2026. Intl.NumberFormat. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat> [Accessed 10 October 2026].
*/