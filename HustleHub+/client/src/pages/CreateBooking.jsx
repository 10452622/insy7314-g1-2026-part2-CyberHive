import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import Navbar
    from "../components/Navbar";

import {
    createBooking,
    getGigById
} from "../services/api";


function CreateBooking() {

    const { gigId } =
        useParams();

    const navigate =
        useNavigate();

    const [gig, setGig] =
        useState(null);

    const [requirements,
        setRequirements] =
        useState("");

    const [paymentMethod,
        setPaymentMethod] =
        useState("card");

    const [loading,
        setLoading] =
        useState(true);

    const [submitting,
        setSubmitting] =
        useState(false);

    const [error,
        setError] =
        useState("");


    useEffect(() => {

        const loadGig = async () => {

            try {

                const data =
                    await getGigById(
                        gigId
                    );

                setGig(data.gig);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        loadGig();

    }, [gigId]);


    const handleBooking =
        async (event) => {

            event.preventDefault();

            if (
                requirements.trim()
                    .length < 5
            ) {
                setError(
                    "Please provide your project requirements."
                );

                return;
            }


            try {

                setSubmitting(true);
                setError("");


                const data =
                    await createBooking(
                        gigId,
                        requirements
                    );


                // Preserve transaction info
                // for confirmation page.
                sessionStorage.setItem(
                    "lastTransaction",
                    JSON.stringify(
                        data.transaction
                    )
                );


                navigate(
                    `/booking/confirmation/${data.booking._id}`
                );

            } catch (err) {

                if (
                    err.message
                        .toLowerCase()
                        .includes(
                            "authentication"
                        ) ||
                    err.message
                        .toLowerCase()
                        .includes("token")
                ) {

                    setError(
                        "Please log in as a Client before booking."
                    );

                } else {

                    setError(
                        err.message
                    );
                }

            } finally {

                setSubmitting(false);
            }
        };


    if (loading) {

        return (
            <>
                <Navbar />

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
                        {error ||
                            "Service unavailable."}
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

                        <h1>
                            Complete your booking
                        </h1>

                        <p>
                            Review your order and
                            tell the freelancer what
                            you need.
                        </p>

                    </div>


                    <form
                        className="booking-grid"
                        onSubmit={
                            handleBooking
                        }
                    >

                        <section className="order-summary">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="summary-service">

                                <div className="summary-image">

                                    {gig.imageUrl ? (

                                        <img
                                            src={
                                                gig.imageUrl
                                            }
                                            alt={
                                                gig.title
                                            }
                                        />

                                    ) : (

                                        <span>
                                            {
                                                gig.category
                                            }
                                        </span>

                                    )}

                                </div>


                                <div>

                                    <h3>
                                        {gig.title}
                                    </h3>

                                    <p>
                                        {
                                            gig.freelancerName
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="summary-line">

                                <span>
                                    Service price
                                </span>

                                <strong>
                                    R{gig.price}
                                </strong>

                            </div>


                            <div className="summary-line">

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {gig.deliveryDays}{" "}
                                    days
                                </strong>

                            </div>


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    R{gig.price}
                                </strong>

                            </div>

                        </section>


                        <section className="booking-form-card">

                            <h2>
                                Your Requirements
                            </h2>

                            <p className="muted">
                                Give the freelancer
                                everything they need
                                to get started.
                            </p>


                            <textarea
                                className="requirements-input"
                                value={
                                    requirements
                                }
                                onChange={(e) =>
                                    setRequirements(
                                        e.target.value
                                    )
                                }
                                maxLength="2000"
                                placeholder="Describe what you need, your preferred style, colours, deadlines or any other important details..."
                                required
                            />


                            <small className="character-count">
                                {
                                    requirements.length
                                }
                                /2000
                            </small>


                            <h2 className="payment-heading">
                                Payment Method
                            </h2>


                            <label className="payment-option">

                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={
                                        paymentMethod ===
                                        "card"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <div>
                                    <strong>
                                        Credit /
                                        Debit Card
                                    </strong>

                                    <small>
                                        Simulated
                                        payment
                                    </small>
                                </div>

                            </label>


                            <label className="payment-option">

                                <input
                                    type="radio"
                                    name="payment"
                                    value="paypal"
                                    checked={
                                        paymentMethod ===
                                        "paypal"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <div>
                                    <strong>
                                        PayPal
                                    </strong>

                                    <small>
                                        Simulated
                                        payment
                                    </small>
                                </div>

                            </label>


                            {error && (
                                <div className="error-box">
                                    {error}
                                </div>
                            )}


                            <button
                                type="submit"
                                className="primary-button full-width large-button"
                                disabled={
                                    submitting
                                }
                            >
                                {submitting
                                    ? "Confirming..."
                                    : `Confirm Booking • R${gig.price}`}
                            </button>


                            <div className="secure-message">
                                🔒 Secure simulated
                                payment
                            </div>

                        </section>

                    </form>

                </div>

            </main>
        </>
    );
}


export default CreateBooking;