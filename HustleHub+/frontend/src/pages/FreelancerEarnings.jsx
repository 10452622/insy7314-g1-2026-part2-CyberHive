import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { fetchFreelancerOrders } from "../services/api";
import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/FreelancerEarnings.css";

const currency = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
});

function getOrderDate(order) {
    const value =
        order.completedAt ||
        order.updatedAt ||
        order.createdAt ||
        order.orderDate ||
        order.date;

    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function getStatus(order) {
    return String(order.status || "").trim().toUpperCase();
}

function getAmount(order) {
    return Math.max(
        0,
        Number(order.amount ?? order.price) || 0
    );
}

function EarningsChart({ values, months }) {
    const width = 520;
    const height = 170;
    const paddingX = 8;
    const paddingY = 12;
    const maxValue = Math.max(...values, 1);

    const points = values
        .map((value, index) => {
            const x =
                paddingX +
                (index / Math.max(values.length - 1, 1)) *
                    (width - paddingX * 2);

            const y =
                height -
                paddingY -
                (value / maxValue) * (height - paddingY * 2);

            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="fe-chart">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Monthly completed earnings trend"
                preserveAspectRatio="none"
            >
                {[0.25, 0.5, 0.75, 1].map((fraction) => {
                    const y =
                        height -
                        paddingY -
                        fraction * (height - paddingY * 2);

                    return (
                        <line
                            key={fraction}
                            x1="0"
                            x2={width}
                            y1={y}
                            y2={y}
                            className="fe-chart-gridline"
                        />
                    );
                })}

                <polyline
                    points={points}
                    className="fe-chart-line"
                />

                {values.map((value, index) => {
                    const x =
                        paddingX +
                        (index / Math.max(values.length - 1, 1)) *
                            (width - paddingX * 2);

                    const y =
                        height -
                        paddingY -
                        (value / maxValue) *
                            (height - paddingY * 2);

                    return (
                        <circle
                            key={`${months[index]}-${index}`}
                            cx={x}
                            cy={y}
                            r="2.5"
                            className="fe-chart-point"
                        />
                    );
                })}
            </svg>

            <div className="fe-chart-months">
                {months.map((month) => (
                    <span key={month}>{month}</span>
                ))}
            </div>
        </div>
    );
}

export default function FreelancerEarnings() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadEarnings() {
            try {
                setLoading(true);
                setError("");

                const response = await fetchFreelancerOrders();

                if (!active) return;

               const bookings = Array.isArray(response?.bookings)
                    ? response.bookings
                    : Array.isArray(response?.data)
                    ? response.data
                    : [];

                if (response?.success) {
                    setOrders(bookings);
                } else {
                    setOrders([]);
                    setError(
                        response?.message ||
                            "Unable to load your earnings right now."
                    );
                }
            } catch {
                if (!active) return;

                setError(
                    "Unable to connect to your earnings data. Please try again."
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        loadEarnings();

        return () => {
            active = false;
        };
    }, []);

    const earnings = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const completedOrders = orders.filter(
            (order) => getStatus(order) === "COMPLETED"
        );

        const pendingOrders = orders.filter(
            (order) => getStatus(order) === "PENDING"
        );

        const totalEarnings = completedOrders.reduce(
            (sum, order) => sum + getAmount(order),
            0
        );

        const thisMonth = completedOrders.reduce((sum, order) => {
            const date = getOrderDate(order);

            if (
                date &&
                date.getFullYear() === currentYear &&
                date.getMonth() === currentMonth
            ) {
                return sum + getAmount(order);
            }

            return sum;
        }, 0);

        const thisYear = completedOrders.reduce((sum, order) => {
            const date = getOrderDate(order);

            if (date && date.getFullYear() === currentYear) {
                return sum + getAmount(order);
            }

            return sum;
        }, 0);

        const pending = pendingOrders.reduce(
            (sum, order) => sum + getAmount(order),
            0
        );

        const months = Array.from({ length: 12 }, (_, index) =>
            new Date(currentYear, index, 1).toLocaleDateString("en-ZA", {
                month: "short",
            })
        );

        const monthlyTrend = Array(12).fill(0);

        completedOrders.forEach((order) => {
            const date = getOrderDate(order);

            if (date && date.getFullYear() === currentYear) {
                monthlyTrend[date.getMonth()] += getAmount(order);
            }
        });

        const servicesMap = new Map();

        completedOrders.forEach((order) => {
            const title =
                order.gigTitle ||
                order.gig?.title ||
                order.title ||
                "Gig";

            servicesMap.set(
                title,
                (servicesMap.get(title) || 0) + getAmount(order)
            );
        });

        const topServices = Array.from(servicesMap, ([name, amount]) => ({
            name,
            amount,
        }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        return {
            totalEarnings,
            thisMonth,
            thisYear,
            pending,
            monthlyTrend,
            months,
            topServices,
        };
    }, [orders]);

    const summaryCards = [
        {
            label: "Total Earnings",
            value: earnings.totalEarnings,
        },
        {
            label: "This Month",
            value: earnings.thisMonth,
        },
        {
            label: "This Year",
            value: earnings.thisYear,
        },
        {
            label: "Pending",
            value: earnings.pending,
        },
    ];

    return (
        <div className="freelancer-dashboard fe-page">
            <FreelancerHeader />

            <main className="freelancer-dashboard-content fe-content">
                <header className="fe-heading">
                    <h1>Earnings</h1>
                    <p>Track your income and performance.</p>
                </header>

                {error && (
                    <div className="fe-error" role="alert">
                        {error}
                    </div>
                )}

                <section
                    className="freelancer-stat-grid fe-summary-grid"
                    aria-label="Earnings summary"
                >
                    {summaryCards.map((card) => (
                        <article className="freelancer-stat" key={card.label}>
                            <span className="freelancer-stat-label">
                                {card.label}
                            </span>

                            <strong className="freelancer-stat-value">
                                {loading ? "—" : currency.format(card.value)}
                            </strong>
                        </article>
                    ))}
                </section>

                <section className="fe-panels">
                    <article className="freelancer-panel fe-overview">
                        <div className="freelancer-panel-heading">
                            <h2>Earnings Overview</h2>

                            <span className="fe-chart-legend">
                                <TrendingUp size={14} />
                                Earnings
                            </span>
                        </div>

                        {loading ? (
                            <p className="fe-feedback">
                                Loading earnings overview...
                            </p>
                        ) : (
                            <EarningsChart
                                values={earnings.monthlyTrend}
                                months={earnings.months}
                            />
                        )}
                    </article>

                    <article className="freelancer-panel fe-services">
                        <div className="freelancer-panel-heading">
                            <h2>Top Services</h2>
                            <Link to="/freelancer/gigs">View Gigs</Link>
                        </div>

                        {loading ? (
                            <p className="fe-feedback">
                                Loading services...
                            </p>
                        ) : earnings.topServices.length === 0 ? (
                            <div className="fe-empty">
                                Your completed services will appear here.
                            </div>
                        ) : (
                            <div className="fe-service-list">
                                {earnings.topServices.map((service) => (
                                    <div
                                        className="fe-service-row"
                                        key={service.name}
                                    >
                                        <span title={service.name}>
                                            {service.name}
                                        </span>

                                        <strong>
                                            {currency.format(service.amount)}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                </section>
            </main>
        </div>
    );
}

/*
Reference List:
React, n.d. Built-in React Hooks. Available at:
https://react.dev/reference/react/hooks
MDN Web Docs, n.d. Array.prototype.reduce(). Available at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
*/
