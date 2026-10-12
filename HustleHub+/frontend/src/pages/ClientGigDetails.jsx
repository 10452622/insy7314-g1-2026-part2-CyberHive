
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ClientNavBar from "../components/ClientNavbar";
import { getGigById } from "../services/api";

const isValidGigId = (id) => /^[a-f\d]{24}$/i.test(id || "");

export default function ClientGigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadGig() {
            setLoading(true);
            setError("");
            setGig(null);

            if (!isValidGigId(id)) {
                setError("This service has an invalid ID.");
                setLoading(false);
                return;
            }

            try {
                const response = await getGigById(id);

                const result =
                    response?.gig ??
                    response?.data?.gig ??
                    response?.data;

                if (!result || result._id !== id) {
                    throw new Error("This service could not be found.");
                }

                if (active) setGig(result);
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load this service.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadGig();

        return () => {
            active = false;
        };
    }, [id]);

    const bookGig = () => {
        if (!gig || !isValidGigId(gig._id)) {
            setError("Booking cannot continue because the service ID is invalid.");
            return;
        }

        if (gig.isActive === false) {
            setError("This service is currently unavailable for booking.");
            return;
        }

        navigate(`/booking/${gig._id}`);
    };

    const freelancerName =
        gig?.freelancerName?.trim() || "Freelancer";

    const freelancerInitial =
        freelancerName.charAt(0).toUpperCase();

    const price = Number(gig?.price);
    const deliveryDays = Number(gig?.deliveryDays);

    return (
        <>
            <ClientNavBar />

            <main className="details-page">
                <div className="page-container">
                    <div className="breadcrumb">
                        <Link to="/client/home">Home</Link>
                        <span>›</span>
                        <Link to="/gigs">Browse Services</Link>
                        <span>›</span>
                        <span>{gig?.category || "Service"}</span>
                    </div>

                    {loading ? (
                        <div className="status-box">
                            Loading service...
                        </div>
                    ) : error && !gig ? (
                        <div className="error-box" role="alert">
                            {error}
                            <p>
                                <Link to="/gigs">
                                    Back to Browse Services
                                </Link>
                            </p>
                        </div>
                    ) : gig ? (
                        <div className="details-grid">
                            <section>
                                <div className="main-gig-image">
                                    {gig.imageUrl ? (
                                        <img
                                            src={gig.imageUrl}
                                            alt={gig.title || "Service"}
                                        />
                                    ) : (
                                        <div className="large-placeholder">
                                            <span>HUSTLEHUB+</span>
                                            <strong>
                                                {gig.category || "Service"}
                                            </strong>
                                        </div>
                                    )}
                                </div>

                                <div className="details-content">
                                    <span className="category-pill">
                                        {gig.category || "General"}
                                    </span>

                                    <h1>{gig.title || "Untitled service"}</h1>

                                    <h2>About this service</h2>
                                    <p>
                                        {gig.description ||
                                            "No description has been provided yet."}
                                    </p>

                                    <hr />

                                    <h2>About the freelancer</h2>

                                    <div className="freelancer-card">
                                        <div className="profile-avatar">
                                            {freelancerInitial}
                                        </div>

                                        <div>
                                            <h3>{freelancerName}</h3>
                                            <p>HustleHub+ Freelancer</p>

                                            <span className="rating">
                                                ★ {gig.rating ?? "New"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <aside className="purchase-card">
                                <span className="category-pill">
                                    {gig.category || "General"}
                                </span>

                                <h2>{gig.title || "Untitled service"}</h2>

                                <div className="seller-detail">
                                    <div className="small-avatar">
                                        {freelancerInitial}
                                    </div>

                                    <div>
                                        <strong>{freelancerName}</strong>
                                        <small>Freelancer</small>
                                    </div>
                                </div>

                                <div className="rating">
                                    ★ <strong>{gig.rating ?? "New"}</strong>

                                    {Number(gig.reviewCount) > 0 &&
                                        ` (${gig.reviewCount} reviews)`}
                                </div>

                                <div className="price-block">
                                    <small>STARTING AT</small>
                                    <strong>
                                        R{Number.isFinite(price) ? price : 0}
                                    </strong>
                                </div>

                                <div className="feature-list">
                                    <div>
                                        ✓{" "}
                                        {Number.isFinite(deliveryDays) &&
                                        deliveryDays > 0
                                            ? `${deliveryDays} day${
                                                  deliveryDays !== 1 ? "s" : ""
                                              } delivery`
                                            : "Delivery time to be confirmed"}
                                    </div>

                                    <div>✓ Submit a booking request</div>
                                    <div>✓ Track your order status</div>
                                </div>

                                {error && (
                                    <p className="error-box" role="alert">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="primary-button full-width large-button"
                                    onClick={bookGig}
                                    disabled={gig.isActive === false}
                                >
                                    {gig.isActive === false
                                        ? "Service Unavailable"
                                        : "Book Now"}
                                </button>

                                <Link
                                    to="/gigs"
                                    className="secondary-button full-width"
                                >
                                    Back to Browse Services
                                </Link>
                            </aside>
                        </div>
                    ) : null}
                </div>
            </main>
        </>
    );
}
