import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getMyBookings
} from "../services/api";


function MyOrders() {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadBookings =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getMyBookings();


                    setBookings(
                        data.bookings || []
                    );

                } catch (err) {

                    setError(
                        err.message ||
                        "Unable to load your orders."
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadBookings();

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-ZA",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    const formatBookingId = (id) => {

        if (!id) {
            return "#HH";
        }


        return (
            "#HH" +
            id
                .slice(-8)
                .toUpperCase()
        );
    };


    return (
        <>
            <Navbar />

            <main className="orders-page">

                <section className="orders-header">

                    <div>
                        <span className="page-eyebrow">
                            CLIENT DASHBOARD
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Keep track of your
                            bookings and delivery
                            dates.
                        </p>
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

                        <h2>
                            Loading your orders...
                        </h2>

                    </div>
                )}


                {!loading && error && (

                    <div className="orders-state error-state">

                        <div className="state-icon">
                            !
                        </div>

                        <h2>
                            We couldn't load your
                            orders
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>
                )}


                {!loading &&
                    !error &&
                    bookings.length === 0 && (

                    <div className="orders-state">

                        <div className="state-icon">
                            📦
                        </div>

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            When you book a service,
                            your order will appear
                            here.
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

                        {bookings.map(
                            (booking) => (

                            <article
                                className="order-card"
                                key={booking._id}
                            >

                                <div className="order-card-image">

                                    {booking.gig?.imageUrl ? (

                                        <img
                                            src={
                                                booking.gig
                                                    .imageUrl
                                            }
                                            alt={
                                                booking.gig
                                                    .title
                                            }
                                        />

                                    ) : (

                                        <div className="order-image-placeholder">

                                            <span>
                                                {
                                                    booking.gig
                                                        ?.category ||
                                                    "Service"
                                                }
                                            </span>

                                        </div>
                                    )}

                                </div>


                                <div className="order-card-content">

                                    <div className="order-top-row">

                                        <div>

                                            <span className="order-reference">
                                                {
                                                    formatBookingId(
                                                        booking._id
                                                    )
                                                }
                                            </span>

                                            <h2>
                                                {
                                                    booking.gig
                                                        ?.title ||
                                                    "Gig"
                                                }
                                            </h2>

                                        </div>


                                        <span
                                            className={
                                                `order-status status-${booking.status
                                                    .toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )}`
                                            }
                                        >
                                            {
                                                booking.status
                                            }
                                        </span>

                                    </div>


                                    <p className="order-freelancer">

                                        Freelancer:{" "}

                                        <strong>
                                            {
                                                booking
                                                    .freelancer
                                                    ?.username ||
                                                "Freelancer"
                                            }
                                        </strong>

                                    </p>


                                    <div className="order-details-grid">

                                        <div>
                                            <span>
                                                Amount
                                            </span>

                                            <strong>
                                                R
                                                {
                                                    booking.amount
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Ordered
                                            </span>

                                            <strong>
                                                {
                                                    formatDate(
                                                        booking.createdAt
                                                    )
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Delivery
                                            </span>

                                            <strong>
                                                {
                                                    formatDate(
                                                        booking.deliveryDate
                                                    )
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="order-actions">

                                        <Link
                                            to={
                                                `/booking/confirmation/${booking._id}`
                                            }
                                            className="secondary-button"
                                        >
                                            View Order
                                        </Link>

                                        {booking.gig?._id && (

                                            <Link
                                                to={
                                                    `/gigs/${booking.gig._id}`
                                                }
                                                className="order-link"
                                            >
                                                View Gig
                                            </Link>
                                        )}

                                    </div>

                                </div>

                            </article>
                        ))}

                    </section>
                )}

            </main>
        </>
    );
}


export default MyOrders;