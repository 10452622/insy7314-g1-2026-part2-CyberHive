
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import FreelancerHeader from "../components/FreelancerHeader";
import { getGigById } from "../services/api";

const isValidGigId = (id) => /^[a-f\d]{24}$/i.test(id || "");

export default function FreelancerGigDetails() {
    const { id } = useParams();

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
                setError("The gig ID is invalid.");
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
                    throw new Error("Gig not found.");
                }

                if (active) setGig(result);
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load this gig.");
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

    return (
        <>
            <FreelancerHeader />

            <main className="details-page">
                <div className="page-container">
                    <Link
                        to="/freelancer/gigs"
                        className="secondary-button"
                    >
                        ← Back to My Gigs
                    </Link>

                    {loading ? (
                        <div className="status-box">Loading your gig...</div>
                    ) : error ? (
                        <div className="error-box" role="alert">
                            {error}
                        </div>
                    ) : (
                        <div className="details-grid">
                            <section>
                                <div className="main-gig-image">
                                    {gig.imageUrl ? (
                                        <img
                                            src={gig.imageUrl}
                                            alt={gig.title || "Gig"}
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
                                    <h1>{gig.title || "Untitled gig"}</h1>

                                    <span className="category-pill">
                                        {gig.category || "Uncategorized"}
                                    </span>

                                    <h2>About this service</h2>
                                    <p>
                                        {gig.description ||
                                            "No description provided."}
                                    </p>
                                </div>
                            </section>

                            <aside className="purchase-card">
                                <h2>Your gig details</h2>

                                <div className="price-block">
                                    <small>YOUR PRICE</small>
                                    <strong>
                                        R{Number(gig.price) || 0}
                                    </strong>
                                </div>

                                <div className="feature-list">
                                    <div>
                                        Delivery:{" "}
                                        {Number(gig.deliveryDays) > 0
                                            ? `${gig.deliveryDays} day(s)`
                                            : "Not specified"}
                                    </div>

                                    <div>
                                        Status:{" "}
                                        {gig.isActive === false
                                            ? "Paused"
                                            : "Active"}
                                    </div>

                                    <div>
                                        Orders: {gig.ordersCount || 0}
                                    </div>
                                </div>

                                <Link
                                    to="/freelancer/gigs"
                                    className="primary-button full-width large-button"
                                >
                                    Manage My Gigs
                                </Link>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
