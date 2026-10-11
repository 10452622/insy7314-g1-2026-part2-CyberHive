import React, { useEffect, useMemo, useState } from "react";
import { Download, FileText, ChevronDown } from "lucide-react";
import { fetchFreelancerOrders } from "../services/api";
import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/FreelancerTransactions.css";

const money = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getOrderDate = (order) =>
  order.createdAt || order.orderDate || order.date || null;

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

function FreelancerTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Transactions");
  const [dateRange, setDateRange] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    fetchFreelancerOrders()
      .then((response) => {
        if (!active) return;

        setOrders(
          Array.isArray(response.bookings) ? response.bookings : []
        );
      })
      .catch((error) => {
        if (!active) return;

        setLoadError(
          error?.message || "Transactions could not be loaded."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const transactions = useMemo(() => {
    const now = new Date();

    return orders
      .filter((order) => order.status === "Completed")
      .filter((order) => {
        if (statusFilter === "All Transactions") return true;

        return (
          String(order.status || "").toLowerCase() ===
          statusFilter.toLowerCase()
        );
      })
      .filter((order) => {
        if (dateRange === "all") return true;

        const date = getOrderDate(order);

        if (!date) return false;

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return false;

        if (dateRange === "month") {
          return (
            parsed.getMonth() === now.getMonth() &&
            parsed.getFullYear() === now.getFullYear()
          );
        }

        if (dateRange === "year") {
          return parsed.getFullYear() === now.getFullYear();
        }

        return true;
      })
      .filter((order) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return [
          order.service,
          order.serviceName,
          order.title,
          order.freelancerName,
          order.clientName,
          order._id,
          order.bookingId,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );
      })
      .sort((a, b) => {
        const first = new Date(getOrderDate(a) || 0).getTime();
        const second = new Date(getOrderDate(b) || 0).getTime();

        return second - first;
      });
  }, [orders, statusFilter, dateRange, search]);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Description",
      "Order ID",
      "Type",
      "Amount",
      "Status",
    ];

    const rows = transactions.map((order) => [
      formatDate(getOrderDate(order)),
      order.serviceName || order.service || order.title || "Service",
      order.bookingId || order._id || "",
      "Income",
      Number(order.amount) || 0,
      order.status || "Completed",
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "freelancer-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const totalIncome = transactions.reduce(
    (sum, order) => sum + (Number(order.amount) || 0),
    0
  );

  return (
    <main className="freelancer-dashboard ftr-page">
      <FreelancerHeader />

      <div className="freelancer-dashboard-content ftr-content">
        <section className="ftr-heading">
          <div>
            <h1>Transaction Records</h1>
            <p>View all your financial transactions in one place.</p>
          </div>

          <button
            type="button"
            className="ftr-export-button"
            onClick={exportCSV}
            disabled={loading || transactions.length === 0}
          >
            <Download size={15} />
            Export CSV
          </button>
        </section>

        {loadError && (
          <p className="ftr-error" role="alert">
            {loadError}
          </p>
        )}

        <section className="ftr-toolbar">
          <label className="ftr-select-wrapper">
            <span className="ftr-sr-only">Transaction status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Transactions</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={14} />
          </label>

          <label className="ftr-select-wrapper">
            <span className="ftr-sr-only">Transaction date range</span>
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            >
              <option value="all">All dates</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
            <ChevronDown size={14} />
          </label>

          <input
            className="ftr-search"
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search transactions"
          />
        </section>

        <section className="ftr-table-panel">
          <div className="ftr-table-heading">
            <div>
              <h2>All Transactions</h2>
              <p>
                {loading
                  ? "Loading records..."
                  : `${transactions.length} transaction${
                      transactions.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <div className="ftr-total">
              <span>Total income</span>
              <strong>{loading ? "—" : money(totalIncome)}</strong>
            </div>
          </div>

          <div className="ftr-table-scroll">
            <table className="ftr-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Order ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="ftr-empty">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="ftr-empty">
                      <FileText size={23} />
                      <strong>No transactions found</strong>
                      <span>
                        Completed bookings will appear here.
                      </span>
                    </td>
                  </tr>
                ) : (
                  transactions.map((order) => (
                    <tr key={order._id || order.bookingId}>
                      <td>{formatDate(getOrderDate(order))}</td>
                      <td className="ftr-description">
                        {order.serviceName ||
                          order.service ||
                          order.title ||
                          "Service"}
                      </td>
                      <td>
                        {order.bookingId ||
                          (order._id
                            ? String(order._id).slice(-8)
                            : "—")}
                      </td>
                      <td>Income</td>
                      <td className="ftr-amount">
                        +{money(order.amount)}
                      </td>
                      <td>
                        <span className="ftr-status">
                          {order.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default FreelancerTransactions;