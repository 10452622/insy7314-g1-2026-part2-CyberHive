
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { getMyBookings } from "../services/api"; //(IIE, 2026)

function MyOrders() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadBookings = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getMyBookings();

                if (active) {
                    setBookings(
                        Array.isArray(data.bookings)
                            ? data.bookings
                            : []
                    );
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message ||
                        "Unable to load your orders."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadBookings();

        return () => {
            active = false;
        };
    }, []);

    const formatDate = (value) => {
        if (!value) return "Not available";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatPrice = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "" ||
            !Number.isFinite(Number(value))
        ) {
            return "Not available";
        }

        return `R${Number(value).toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatBookingId = (id) => {
        if (!id) return "#HH";

        return (
            "#HH" +
            String(id).slice(-8).toUpperCase()
        );
    };

    const getStatusClass = (status) => {
        const safeStatus = status || "Pending";

        return (
            "order-status status-" +
            safeStatus.toLowerCase().replace(/\s+/g, "-")
        );
    };

    return (
        <>
            <ClientNavbar />

            <main className="orders-page">
                <section className="orders-header">
                    <div>
                        <span className="page-eyebrow">
                            CLIENT DASHBOARD
                        </span>

                        <h1>My Orders</h1>

                        <p>
                            Keep track of your bookings
                            and delivery dates.
                        </p>  {/*(MDN Web Docs, 2026) */} 
                    </div>

                    <Link
                        to="/gigs"
                        className="primary-button"
                    >
                        Browse More Gigs
                    </Link>
                </section>

                {loading && (
                    <div className="orders-state">
                        <div className="state-icon">
                            ⏳
                        </div>

                        <h2>Loading your orders...</h2>
                    </div>
                )}

                {!loading && error && (
                    <div className="orders-state error-state">
                        <div className="state-icon">
                            !
                        </div> {/*(MDN Web Docs, 2026) */} 

                        <h2>
                            We couldn't load your orders
                        </h2>

                        <p>{error}</p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    bookings.length === 0 && (
                        <div className="orders-state">
                            <div className="state-icon">
                                📦
                            </div>

                            <h2>No orders yet</h2>

                            <p>
                                When you book a service,
                                your order will appear here.
                            </p>

                            <Link
                                to="/gigs"
                                className="primary-button"
                            >
                                Find a Freelancer
                            </Link>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    bookings.length > 0 && (
                        <section className="orders-list">
                            {bookings.map((booking) => {
                                const status =
                                    booking.status || "Pending";

                                return (
                                    <article
                                        className="order-card"
                                        key={booking._id}
                                    >
                                        <div className="order-card-image">
                                            {booking.gig?.imageUrl ? (
                                                <img
                                                    src={booking.gig.imageUrl}
                                                    alt={
                                                        booking.gig.title ||
                                                        "Service"
                                                    }
                                                />
                                            ) : (
                                                <div className="order-image-placeholder">
                                                    <span>
                                                        {booking.gig?.category ||
                                                            "Service"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="order-card-content">
                                            <div className="order-top-row">
                                                <div>
                                                    <span className="order-reference">
                                                        {formatBookingId(
                                                            booking._id
                                                        )}
                                                    </span>

                                                    <h2>
                                                        {booking.gig?.title ||
                                                            "Gig"}
                                                    </h2>
                                                </div>

                                                <span
                                                    className={getStatusClass(
                                                        status
                                                    )}
                                                >
                                                    {status}
                                                </span>
                                            </div>

                                            <p className="order-freelancer">
                                                Freelancer:{" "}
                                                <strong>
                                                    {booking.gig?.freelancerName ||
                                                        "Freelancer"}
                                                </strong>
                                            </p>

                                            <div className="order-details-grid">
                                                <div>
                                                    <span>Amount</span>
                                                    <strong>
                                                        {formatPrice(
                                                            booking.amount
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Ordered</span>
                                                    <strong>
                                                        {formatDate(
                                                            booking.createdAt
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Delivery</span>
                                                    <strong>
                                                        {formatDate(
                                                            booking.deliveryDate
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="order-actions">
                                                <Link
                                                    to={`/booking/confirmation/${booking._id}`}
                                                    className="secondary-button"
                                                >
                                                    View Order
                                                </Link>

                                                {booking.gig?._id && (
                                                    <Link
                                                        to={`/gigs/${booking.gig._id}`}
                                                        className="order-link"
                                                    >
                                                        View Gig
                                                    </Link> //(MDN Web Docs, 2026) 
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    )}
            </main>
        </>
    );
}

export default MyOrders;

/*Reference List

MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 7 October 2026]. 

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
Education: Unpublished.
*/