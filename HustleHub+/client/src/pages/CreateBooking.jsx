
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { createBooking, getGigById } from "../services/api";

function CreateBooking() {
    const { gigId } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [requirements, setRequirements] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadGig = async () => {
            setLoading(true);
            setError("");
            setGig(null);

            try {
                const data = await getGigById(gigId);

                if (active) {
                    setGig(data.gig || null);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "Unable to load this service."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadGig();

        return () => {
            active = false;
        };
    }, [gigId]);

    const handleBooking = async (event) => {
        event.preventDefault();

        if (submitting) return;

        if (requirements.trim().length < 5) {
            setError(
                "Please provide at least 5 characters describing your project."
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const data = await createBooking(
                gigId,
                requirements.trim()
            );

            if (!data.booking?._id) {
                throw new Error(
                    "The booking response did not include a booking ID. Please check My Orders before submitting again."
                );
            }

            navigate(
                `/booking/confirmation/${data.booking._id}`,
                { replace: true }
            );
        } catch (err) {
            const message = err?.message || "Unable to submit booking.";
            const lowerMessage = message.toLowerCase();

            if (
                lowerMessage.includes("authentication") ||
                lowerMessage.includes("token") ||
                lowerMessage.includes("unauthorized") ||
                lowerMessage.includes("401")
            ) {
                setError(
                    "Please log in as a Client before booking."
                );
            } else {
                setError(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "" ||
            !Number.isFinite(Number(value))
        ) {
            return "Price unavailable";
        }

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
                        Loading booking...
                    </div>
                </div>
            </>
        );
    }

    if (!gig) {
        return (
            <>
                <ClientNavbar />
                <div className="page-container">
                    <div className="error-box">
                        {error || "Service unavailable."}
                    </div>

                    <Link
                        to="/gigs"
                        className="secondary-button"
                    >
                        Back to Browse Gigs
                    </Link>
                </div>
            </>
        );
    }

    const deliveryDays = Number(gig.deliveryDays);

    const deliveryLabel =
        gig.deliveryDays != null &&
        gig.deliveryDays !== "" &&
        Number.isFinite(deliveryDays)
            ? `${deliveryDays} day${deliveryDays === 1 ? "" : "s"}`
            : "Not specified";

    return (
        <>
            <ClientNavbar />

            <main className="booking-page">
                <div className="booking-container">
                    <div className="booking-heading">
                        <span className="section-label">
                            CHECKOUT
                        </span>

                        <h1>Complete your booking</h1>

                        <p>
                            Review your order and tell the
                            freelancer what you need.
                        </p>
                    </div>

                    <form
                        className="booking-grid"
                        onSubmit={handleBooking}
                    >
                        <section className="order-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-service">
                                <div className="summary-image">
                                    {gig.imageUrl ? (
                                        <img
                                            src={gig.imageUrl}
                                            alt={gig.title}
                                        />
                                    ) : (
                                        <span>
                                            {gig.category || "Service"}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3>{gig.title}</h3>
                                    <p>
                                        {gig.freelancerName ||
                                            "Freelancer"}
                                    </p>
                                </div>
                            </div>

                            <div className="summary-line">
                                <span>Service price</span>
                                <strong>
                                    {formatPrice(gig.price)}
                                </strong>
                            </div>

                            <div className="summary-line">
                                <span>Delivery</span>
                                <strong>{deliveryLabel}</strong>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>
                                    {formatPrice(gig.price)}
                                </strong>
                            </div>
                        </section>

                        <section className="booking-form-card">
                            <h2>Your Requirements</h2>

                            <p className="muted">
                                Give the freelancer everything
                                they need to get started.
                            </p>

                            <textarea
                                className="requirements-input"
                                value={requirements}
                                onChange={(event) =>
                                    setRequirements(event.target.value)
                                }
                                minLength={5}
                                maxLength={2000}
                                placeholder="Describe what you need, your preferred style, colours, deadlines or any other important details..."
                                required
                                disabled={submitting}
                            />

                            <small className="character-count">
                                {requirements.length}/2000
                            </small>

                            <h2 className="payment-heading">
                                Booking Status
                            </h2>

                            <p className="muted">
                                Your booking will be submitted
                                as Pending. No payment will be
                                processed at this stage.
                            </p>

                            {error && (
                                <div
                                    className="error-box"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="primary-button full-width large-button"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Submitting..."
                                    : `Submit Booking • ${formatPrice(gig.price)}`}
                            </button>

                            <div className="secure-message">
                                Your booking request will be
                                recorded without processing a payment.
                            </div>
                        </section>
                    </form>
                </div>
            </main>
        </>
    );
}

export default CreateBooking;
