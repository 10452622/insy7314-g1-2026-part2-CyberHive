
import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { getBookingById } from "../services/api";

function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const checkoutCompleted =
        location.state?.checkoutCompleted === true;

    const paymentMethod =
        location.state?.paymentMethod === "card"
            ? "Card"
            : location.state?.paymentMethod === "eft"
                ? "EFT"
                : null;

    useEffect(() => {
        let active = true;

        const loadBooking = async () => {
            setLoading(true);
            setError("");
            setBooking(null);

            try {
                const data = await getBookingById(bookingId);

                if (active) {
                    setBooking(data.booking || null);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "Unable to load booking."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadBooking();

        return () => {
            active = false;
        };
    }, [bookingId]);

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
        } /* //(MDN Web Docs, 2026) */

        return `R${Number(value).toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    if (loading) {
        return (
            <>
                <ClientNavbar />

                <div className="page-container">
                    <div className="status-box">
                        Loading booking details...
                    </div>
                </div>
            </>
        );
    }

    if (error || !booking) {
        return (
            <>
                <ClientNavbar />

                <div className="page-container">
                    <div className="error-box">
                        {error || "Booking not found."}
                    </div>

                    <Link
                        to="/client/orders"
                        className="secondary-button"
                    >
                        Back to My Orders
                    </Link>
                </div>
            </>
        );
    }

    const status = booking.status || "Pending";

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const bookingReference = booking._id
        ? String(booking._id).slice(-8).toUpperCase()
        : "UNKNOWN";

    return (
        <>
            <ClientNavbar />

            <main className="confirmation-page">
                <div className="confirmation-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <span className="section-label">
                        BOOKING DETAILS
                    </span>

                    <h1>Booking Details</h1>

                    <p className="confirmation-intro">
                        Your booking request has been recorded
                        successfully. You can track its status
                        in My Orders.
                    </p>

                    <div className="confirmation-info">

                        <div>
                            <span>Booking ID</span>

                            <strong>
                                #HH{bookingReference}
                            </strong>
                        </div>

                        <div>
                            <span>Service</span>

                            <strong>
                                {booking.gig?.title ||
                                    "Service unavailable"}
                            </strong>
                        </div>

                        <div>
                            <span>Freelancer</span>

                            <strong>
                                {booking.gig?.freelancerName ||
                                    "Freelancer"}
                            </strong>
                        </div>

                        <div>
                            <span>Amount</span>

                            <strong>
                                {formatPrice(booking.amount)}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>

                            <strong
                                className={`order-status status-${statusClass}`}
                            >
                                {status}
                            </strong>
                        </div>

                        <div>
                            <span>Expected delivery</span>

                            <strong>
                                {formatDate(booking.deliveryDate)}
                            </strong>
                        </div>

                        <div>
                            <span>Payment Status</span>

                            <strong>
                                {checkoutCompleted
                                    ? "Checkout completed"
                                    : "Not recorded"}
                            </strong>
                        </div>

                        {checkoutCompleted && paymentMethod && (
                            <div>
                                <span>Payment Method</span>

                                <strong>
                                    {paymentMethod}
                                </strong>
                            </div>
                        )}

                    </div>

                    <div className="confirmation-actions">

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate("/client/orders")
                            }
                        >
                            View My Orders
                        </button>

                        <button
                            type="button"
                            className="secondary-button" /* //(MDN Web Docs, 2026) */
                            onClick={() =>
                                navigate("/gigs")
                            }
                        >
                            Continue Browsing
                        </button>

                    </div>

                </div>
            </main>
        </>
    );
}

export default BookingConfirmation;

/*Reference List

MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 7 October 2026].
*/
