
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const loadGig = async () => {
            try {
                const data = await getGigById(gigId);
                setGig(data.gig);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGig();
    }, [gigId]);

    const handleBooking = async (event) => {
        event.preventDefault();

        if (requirements.trim().length < 5) {
            setError("Please provide your project requirements.");
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
                    "Booking response did not include a booking ID."
                );
            }

            navigate(
                `/booking/confirmation/${data.booking._id}`
            );
        } catch (err) {
            const message = err.message.toLowerCase();

            if (
                message.includes("authentication") ||
                message.includes("token") ||
                message.includes("unauthorized")
            ) {
                setError("Please log in as a Client before booking.");
            } else {
                setError(err.message);
            }
        } finally {
            setSubmitting(false);
        }
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
                <Navbar />
                <div className="page-container">
                    <div className="error-box">
                        {error || "Service unavailable."}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

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
                                            {gig.category}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3>{gig.title}</h3>
                                    <p>{gig.freelancerName}</p>
                                </div>
                            </div>

                            <div className="summary-line">
                                <span>Service price</span>
                                <strong>R{gig.price}</strong>
                            </div>

                            <div className="summary-line">
                                <span>Delivery</span>
                                <strong>
                                    {gig.deliveryDays} days
                                </strong>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>R{gig.price}</strong>
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
                                onChange={(e) =>
                                    setRequirements(e.target.value)
                                }
                                maxLength={2000}
                                placeholder="Describe what you need, your preferred style, colours, deadlines or any other important details..."
                                required
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
                                <div className="error-box">
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
                                    : `Submit Booking • R${gig.price}`}
                            </button>

                            <div className="secure-message">
                                Your booking will be recorded
                                as Pending.
                            </div>
                        </section>
                    </form>
                </div>
            </main>
        </>
    );
}

export default CreateBooking;
