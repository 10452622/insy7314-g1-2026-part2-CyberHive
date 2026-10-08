
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { getBookingById } from "../services/api";

function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBooking = async () => {
            try {
                const data = await getBookingById(bookingId);
                setBooking(data.booking);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <>
                <ClientNavbar />
                <div className="page-container">
                    <div className="status-box">
                        Loading confirmation...
                    </div>
                </div>
            </>
        );
    }

    if (error || !booking) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <div className="error-box">
                        {error || "Booking not found."}
                    </div>
                </div>
            </>
        );
    }

    const formattedDate = booking.deliveryDate
        ? new Date(booking.deliveryDate).toLocaleDateString(
            "en-ZA",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
        : "Not available";

    const bookingReference = booking._id
        .slice(-8)
        .toUpperCase();

    return (
        <>
            <Navbar />

            <main className="confirmation-page">
                <div className="confirmation-card">
                    <div className="success-icon">
                        ✓
                    </div>

                    <span className="section-label">
                        BOOKING SUBMITTED
                    </span>

                    <h1>Booking Submitted!</h1>

                    <p className="confirmation-intro">
                        Your booking has been submitted
                        successfully and is currently pending.
                        No payment has been processed.
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
                                R{booking.amount}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong
                                className={
                                    booking.status === "Pending"
                                        ? "order-status status-pending"
                                        : "confirmed-status"
                                }
                            >
                                {booking.status}
                            </strong>
                        </div>

                        <div>
                            <span>Expected delivery</span>
                            <strong>
                                {formattedDate}
                            </strong>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/client/orders")
                            }
                        >
                            View My Order
                        </button>

                        <button
                            className="secondary-button"
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
