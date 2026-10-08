import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";

import {
    getGigById
} from "../services/api";


function GigDetails() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [gig, setGig] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadGig = async () => {

            try {

                const data =
                    await getGigById(id);

                setGig(data.gig);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        loadGig();

    }, [id]);


    if (loading) {

        return (
            <>
              <ClientNavbar />

                <div className="page-container">
                    <div className="status-box">
                        Loading service...
                    </div>
                </div>
            </>
        );
    }


    if (error || !gig) {

        return (
            <>
                <Navbar />

                <div className="page-container">
                    <div className="error-box">
                        {error ||
                            "Service not found."}
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            <Navbar />


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

                        <span>
                            {gig.category}
                        </span>

                    </div>


                    <div className="details-grid">

                        <section>

                            <div className="main-gig-image">

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

                                    <div className="large-placeholder">

                                        <span>
                                            BRAND
                                        </span>

                                        <strong>
                                            {gig.category}
                                        </strong>

                                        <small>
                                            HUSTLEHUB+
                                        </small>

                                    </div>

                                )}

                            </div>


                            <div className="thumbnail-row">

                                {[1, 2, 3].map(
                                    (number) => (

                                        <div
                                            key={number}
                                            className="thumbnail-placeholder"
                                        >
                                            {number}
                                        </div>

                                    )
                                )}

                            </div>


                            <div className="details-content">

                                <h2>
                                    About this service
                                </h2>

                                <p>
                                    {gig.description}
                                </p>


                                <hr />


                                <h2>
                                    About the freelancer
                                </h2>

                                <div className="freelancer-card">

                                    <div className="profile-avatar">
                                        {gig.freelancerName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                gig.freelancerName
                                            }
                                        </h3>

                                        <p>
                                            Verified
                                            HustleHub
                                            Freelancer
                                        </p>

                                        <span className="rating">
                                            ★{" "}
                                            {gig.rating ||
                                                "New"}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        <aside className="purchase-card">

                            <span className="category-pill">
                                {gig.category}
                            </span>


                            <h1>
                                {gig.title}
                            </h1>


                            <div className="seller-detail">

                                <div className="small-avatar">
                                    {gig.freelancerName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <strong>
                                        {
                                            gig.freelancerName
                                        }
                                    </strong>

                                    <small>
                                        Verified
                                        Freelancer
                                    </small>
                                </div>

                            </div>


                            <div className="rating">
                                ★{" "}
                                <strong>
                                    {gig.rating ||
                                        "New"}
                                </strong>

                                {gig.reviewCount >
                                    0 &&
                                    ` (${gig.reviewCount} reviews)`}
                            </div>


                            <div className="price-block">

                                <small>
                                    FROM
                                </small>

                                <strong>
                                    R{gig.price}
                                </strong>

                            </div>


                            <div className="feature-list">

                                <div>
                                    ✓{" "}
                                    {gig.deliveryDays}{" "}
                                    day
                                    {gig.deliveryDays !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    delivery
                                </div>

                                <div>
                                    ✓ Secure booking
                                </div>

                                <div>
                                    ✓ Direct freelancer
                                    communication
                                </div>

                            </div>


                            <button
                                className="primary-button full-width large-button"
                                onClick={() =>
                                    navigate(
                                        `/booking/${gig._id}`
                                    )
                                }
                            >
                                Book Now
                            </button>


                            <button className="secondary-button full-width">
                                Message Freelancer
                            </button>


                            <button className="save-button">
                                ♡ Save
                            </button>

                        </aside>

                    </div>

                </div>

            </main>
        </>
    );
}


export default GigDetails;