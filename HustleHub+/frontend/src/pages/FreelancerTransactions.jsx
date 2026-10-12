
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

// Use the best available date for a completed booking.
// completedAt should be added to the backend schema for accuracy.
const getOrderDate = (order) =>
  order.completedAt ||
  order.updatedAt ||
  order.createdAt ||
  order.orderDate ||
  order.date ||
  null;

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

const getDescription = (order) =>
  order.gig?.title ||
  order.gig?.name ||
  order.serviceName ||
  order.service ||
  order.title ||
  "Freelance service";

const getBookingId = (order) =>
  order._id || order.bookingId || "";

const isCompleted = (order) =>
  String(order.status || "").trim().toUpperCase() === "COMPLETED";

function FreelancerTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetchFreelancerOrders();

        if (!active) return;

        // Support the response shape returned by the existing API,
        // as well as common wrapped response formats.
        const payload = response?.data ?? response;

        const bookings = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.bookings)
          ? payload.bookings
          : Array.isArray(payload?.orders)
          ? payload.orders
          : null;

        if (!bookings) {
          throw new Error(
            "The bookings API returned an unexpected response format."
          );
        }

        setOrders(bookings);
      } catch (error) {
        if (!active) return;

        setOrders([]);
        setLoadError(
          error?.message ||
            "Transactions could not be loaded. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  // A completed booking is treated as an income record.
  // This does not independently verify that a payment was received.
  const completedOrders = useMemo(
    () => orders.filter(isCompleted),
    [orders]
  );

  const transactions = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    return completedOrders
      .filter((order) => {
        if (dateRange === "all") return true;

        const dateValue = getOrderDate(order);

        if (!dateValue) return false;

        const parsed = new Date(dateValue);

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
        if (!query) return true;

        const searchableValues = [
          getDescription(order),
          order.client,
          order.clientName,
          order.freelancer,
          order.freelancerName,
          order._id,
          order.bookingId,
          order.status,
          order.amount,
        ];

        return searchableValues
          .filter((value) => value !== null && value !== undefined)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );
      })
      .sort((a, b) => {
        const first = new Date(getOrderDate(a) || 0).getTime();
        const second = new Date(getOrderDate(b) || 0).getTime();

        return second - first;
      });
  }, [completedOrders, dateRange, search]);

  // Total income reflects the currently filtered transaction list.
  const totalIncome = useMemo(
    () =>
      transactions.reduce(
        (sum, order) => sum + (Number(order.amount) || 0),
        0
      ),
    [transactions]
  );

  const exportCSV = () => {
    if (loading || loadError || transactions.length === 0) return;

    const headers = [
      "Date",
      "Description",
      "Booking ID",
      "Type",
      "Amount (ZAR)",
      "Status",
    ];

    const rows = transactions.map((order) => [
      formatDate(getOrderDate(order)),
      getDescription(order),
      getBookingId(order),
      "Completed booking income",
      Number(order.amount) || 0,
      order.status || "Completed",
    ]);

    const escapeCSV = (value) => {
      let text = String(value ?? "");

      // Reduce the risk of spreadsheet formula injection
      // when opening exported data in spreadsheet software.
      if (/^[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "freelancer-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="freelancer-dashboard ftr-page">
      <FreelancerHeader />

      <div className="freelancer-dashboard-content ftr-content">
        <section className="ftr-heading">
          <div>
            <h1>Transaction Records</h1>
            <p>
              Review your completed booking income and export
              your transaction records.
            </p>
          </div>

          <button
            type="button"
            className="ftr-export-button"
            onClick={exportCSV}
            disabled={
              loading ||
              Boolean(loadError) ||
              transactions.length === 0
            }
          >
            <Download size={15} aria-hidden="true" />
            Export CSV
          </button>
        </section>

        {loadError && (
          <div className="ftr-error" role="alert">
            <p>{loadError}</p>
            <p>
              Please check your connection and sign-in status,
              then reload the page.
            </p>
          </div>
        )}

        <section className="ftr-toolbar">
          <label className="ftr-select-wrapper">
            <span className="ftr-sr-only">
              Transaction status
            </span>

            <select value="Completed" disabled>
              <option value="Completed">
                Completed Transactions
              </option>
            </select>

            <ChevronDown size={14} aria-hidden="true" />
          </label>

          <label className="ftr-select-wrapper">
            <span className="ftr-sr-only">
              Transaction date range
            </span>

            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value)
              }
            >
              <option value="all">All dates</option>
              <option value="month">This month</option>
              <option value="year">This calendar year</option>
            </select>

            <ChevronDown size={14} aria-hidden="true" />
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
              <h2>Completed Transactions</h2>

              <p>
                {loading
                  ? "Loading records..."
                  : loadError
                  ? "Records unavailable"
                  : `${transactions.length} transaction${
                      transactions.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <div className="ftr-total">
              <span>Total booking income</span>

              <strong>
                {loading || loadError ? "—" : money(totalIncome)}
              </strong>
            </div>
          </div>

          <div className="ftr-table-scroll">
            <table className="ftr-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="ftr-empty">
                      Loading transactions...
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={6} className="ftr-empty">
                      Transactions could not be retrieved.
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ftr-empty">
                      <FileText size={23} aria-hidden="true" />

                      <strong>No transactions found</strong>

                      <span>
                        Completed bookings matching your filters
                        will appear here.
                      </span>
                    </td>
                  </tr>
                ) : (
                  transactions.map((order) => (
                    <tr key={getBookingId(order)}>
                      <td>{formatDate(getOrderDate(order))}</td>

                      <td className="ftr-description">
                        {getDescription(order)}
                      </td>

                      <td>
                        {getBookingId(order)
                          ? String(getBookingId(order)).slice(-8)
                          : "—"}
                      </td>

                      <td>Booking income</td>

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

        <aside className="fet-disclaimer">
          <strong>Income record clarification</strong>
          <p>
            These records are based on completed bookings returned
            by HustleHub+. The booking amount is not necessarily
            the amount received after fees, refunds or adjustments.
            A completed booking alone does not confirm successful
            payment.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default FreelancerTransactions;
