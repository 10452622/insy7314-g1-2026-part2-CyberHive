
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { getGigById } from "../services/api"; //(IIE, 2026)

function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadGig = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getGigById(id);

                if (active) {
                    setGig(data.gig);
                }
            } catch (err) {
                if (active) {
                    setError(err.message);
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
    }, [id]);

    if (loading) {
        return (
            <>
                <ClientNavbar />

                <div className="page-container">
                    <div className="status-box">  {/* //(MDN Web Docs, 2026) */}
                        Loading service...
                    </div>
                </div>
            </>
        );
    }

    if (error || !gig) {
        return (
            <>
                <ClientNavbar />

                <div className="page-container">
                    <div className="error-box">
                        {error || "Service not found."}
                    </div>

                    <Link to="/gigs" className="secondary-button">
                        Back to Browse Gigs
                    </Link>
                </div>
            </>
        );
    }

    const freelancerName = gig.freelancerName || "Freelancer";
    const freelancerInitial = freelancerName.charAt(0).toUpperCase();

    return (
        <>
            <ClientNavbar />

            <main className="details-page">
                <div className="page-container">
                    <div className="breadcrumb">
                        <Link to="/client/home">
                            Home
                        </Link>

                        <span>›</span>

                        <Link to="/gigs">
                            Browse Services
                        </Link>

                        <span>›</span>

                        <span>{gig.category}</span>
                    </div>

                    <div className="details-grid">
                        <section>
                            <div className="main-gig-image">
                                {gig.imageUrl ? (
                                    <img
                                        src={gig.imageUrl}
                                        alt={gig.title}
                                    />
                                ) : (
                                    <div className="large-placeholder">
                                        <span>BRAND</span>
                                        <strong>{gig.category}</strong>
                                        <small>HUSTLEHUB+</small>
                                    </div>
                                )}
                            </div>

                            <div className="thumbnail-row">
                                {[1, 2, 3].map((number) => (
                                    <div
                                        key={number}
                                        className="thumbnail-placeholder"
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>

                            <div className="details-content">  {/* //(MDN Web Docs, 2026) */}
                                <h2>About this service</h2>

                                <p>{gig.description}</p>

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
                                {gig.category}
                            </span>

                            <h1>{gig.title}</h1>

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
                                ★{" "}
                                <strong>
                                    {gig.rating ?? "New"}
                                </strong>

                                {gig.reviewCount > 0 &&
                                    ` (${gig.reviewCount} reviews)`}
                            </div>

                            <div className="price-block">
                                <small>FROM</small>
                                <strong>R{gig.price}</strong>
                            </div>

                            <div className="feature-list">
                                <div>
                                    ✓ {gig.deliveryDays} day
                                    {gig.deliveryDays !== 1 ? "s" : ""} delivery
                                </div>

                                <div>✓ Booking request submission</div>
                                <div>✓ Track booking status in My Orders</div>
                            </div>

                            <button //(MDN Web Docs, 2026) 
                                type="button"  
                                className="primary-button full-width large-button"
                                onClick={() =>
                                    navigate(`/booking/${gig._id}`)
                                }
                            >
                                Book Now
                            </button>

                            <button
                                type="button"
                                className="secondary-button full-width"
                                disabled
                                title="Freelancer messaging is not available yet"
                            >
                                Message Freelancer — Coming Soon
                            </button>

                            <button
                                type="button"
                                className="save-button"
                                disabled
                                title="Saving gigs is not available yet"
                            >
                                ♡ Save — Coming Soon
                            </button>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

export default GigDetails;

/*Reference List

MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 7 October 2026]. 

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
Education: Unpublished.
*/