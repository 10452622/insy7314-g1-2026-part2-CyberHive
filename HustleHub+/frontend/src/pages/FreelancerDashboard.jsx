import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchFreelancerGigs, fetchFreelancerOrders } from "../services/api";
import FreelancerHeader, { getFreelancerDisplayName } from "../components/FreelancerHeader";
import "../styles/FreelancerDashboard.css";

const money = (amount) => new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
}).format(Number(amount) || 0);

function FreelancerDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeGigs, setActiveGigs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const firstName = getFreelancerDisplayName().split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    let isCurrent = true;

    Promise.allSettled([fetchFreelancerOrders(), fetchFreelancerGigs()]).then(([orderResult, gigResult]) => {
      if (!isCurrent) return;

      if (orderResult.status === "fulfilled") {
        setOrders(Array.isArray(orderResult.value.bookings) ? orderResult.value.bookings : []);
      } else {
        setLoadError(orderResult.reason?.message || "Orders could not be loaded.");
      }

      if (gigResult.status === "fulfilled") {
        setActiveGigs(Array.isArray(gigResult.value.gigs) ? gigResult.value.gigs.length : 0);
      } else {
        setLoadError((previous) => previous || gigResult.reason?.message || "Your gigs could not be loaded.");
      }

      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const completedOrders = orders.filter((order) => order.status === "Completed");
  const totalEarnings = completedOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const chartValues = Array.from({ length: 6 }, (_, index) => {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() - (5 - index));
    return completedOrders
      .filter((order) => {
        const createdAt = new Date(order.createdAt);
        return createdAt.getMonth() === month.getMonth() && createdAt.getFullYear() === month.getFullYear();
      })
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  });
  const chartMax = Math.max(...chartValues, 1);
  const chartPoints = chartValues
    .map((value, index) => `${index * 52},${94 - (value / chartMax) * 70}`)
    .join(" ");
  const monthLabels = Array.from({ length: 6 }, (_, index) => {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() - (5 - index));
    return month.toLocaleString("en", { month: "short" });
  });

  const stats = [
    { label: "Total Earnings", value: money(totalEarnings), detail: "Completed bookings" },
    { label: "Active Gigs", value: activeGigs, detail: "Visible to clients" },
    { label: "Pending Orders", value: pendingOrders, detail: "Awaiting your response", to: "/freelancer/orders" },
    { label: "Completed Orders", value: completedOrders.length, detail: "Successfully delivered" },
  ];

  return (
    <main className="freelancer-dashboard">
      <FreelancerHeader />

      <div className="freelancer-dashboard-content">
        <section className="freelancer-welcome">
          <p className="freelancer-eyebrow">Freelancer dashboard</p>
          <h1>{greeting}, {firstName}!</h1>
          <p>Here’s what’s happening with your business today.</p>
        </section>

        {loadError && <p className="freelancer-dashboard-error" role="status">{loadError}</p>}

        <section className="freelancer-stat-grid" aria-label="Freelancer performance summary">
          {stats.map((stat) => {
            const content = (
              <>
                <span className="freelancer-stat-label">{stat.label}</span>
                <strong className="freelancer-stat-value">{loading ? "—" : stat.value}</strong>
                <span className="freelancer-stat-detail">{stat.detail}</span>
              </>
            );

            return stat.to ? (
              <NavLink className="freelancer-stat" key={stat.label} to={stat.to}>{content}</NavLink>
            ) : (
              <article className="freelancer-stat" key={stat.label}>{content}</article>
            );
          })}
        </section>

        <section className="freelancer-dashboard-panels">
          <article className="freelancer-panel freelancer-orders-panel">
            <div className="freelancer-panel-heading">
              <h2>Recent Orders</h2>
              <NavLink to="/freelancer/orders">View all</NavLink>
            </div>
            {loading ? (
              <p className="freelancer-empty-state">Loading orders…</p>
            ) : orders.length === 0 ? (
              <div className="freelancer-empty-state">
                <p>No bookings yet.</p>
                <span>When a client books one of your gigs, it will show up here.</span>
              </div>
            ) : (
              <div className="freelancer-table-wrap">
                <table className="freelancer-orders-table">
                  <thead>
                    <tr><th>Service</th><th>Client</th><th>Status</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td className="freelancer-order-title">{order.gig?.title || "Service booking"}</td>
                        <td>{order.clientName || "Client"}</td>
                        <td><span className={`freelancer-status freelancer-status-${String(order.status || "pending").toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span></td>
                        <td className="freelancer-order-amount">{money(order.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="freelancer-panel freelancer-earnings-panel">
            <div className="freelancer-panel-heading">
              <h2>Earnings Overview</h2>
              <NavLink to="/freelancer/earnings">Last 6 months</NavLink>
            </div>
            {loading ? (
              <p className="freelancer-empty-state">Loading earnings…</p>
            ) : completedOrders.length === 0 ? (
              <div className="freelancer-chart-empty">
                <svg viewBox="0 0 260 120" role="img" aria-label="Earnings chart with no completed bookings yet">
                  {[24, 59, 94].map((y) => <line key={y} x1="0" x2="260" y1={y} y2={y} />)}
                  <polyline points="0,94 52,94 104,94 156,94 208,94 260,94" />
                </svg>
                <p>Earnings from completed orders will appear here.</p>
              </div>
            ) : (
              <div className="freelancer-chart-wrap">
                <svg viewBox="0 0 260 120" role="img" aria-label="Monthly earnings from completed orders over the last six months">
                  {[24, 59, 94].map((y) => <line key={y} x1="0" x2="260" y1={y} y2={y} />)}
                  <polyline className="freelancer-chart-line" points={chartPoints} />
                  {chartValues.map((value, index) => <circle key={index} cx={index * 52} cy={94 - (value / chartMax) * 70} r="3" />)}
                </svg>
                <div className="freelancer-chart-months">{monthLabels.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}</div>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

export default FreelancerDashboard;

/* Reference List
React, 2026. Built-in React Hooks. [online] Available at: <https://react.dev/reference/react/hooks> [Accessed 10 October 2026].
React Router, n.d. NavLink. [online] Available at: <https://reactrouter.com/api/components/NavLink> [Accessed 10 October 2026].
MDN Web Docs, 2026. Promise.allSettled(). [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled> [Accessed 10 October 2026].
MDN Web Docs, 2026. Intl.NumberFormat. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat> [Accessed 10 October 2026].
*/