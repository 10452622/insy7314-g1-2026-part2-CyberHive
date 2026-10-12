import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import ClientNavBar from "../components/ClientNavbar";
import { getGigs } from "../services/api";

import "../styles/FreelancerDashboard.css";

export default function ClientGigs() {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadGigs() {
            setLoading(true);
            setError("");

            try {
                const response = await getGigs();

                const result =
                    Array.isArray(response)
                        ? response
                        : response?.gigs ??
                          response?.data?.gigs ??
                          response?.data ??
                          [];

                if (active) {
                    setGigs(
                        Array.isArray(result)
                            ? result.filter((gig) => gig.isActive !== false)
                            : []
                    );
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load available services.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadGigs();

        return () => {
            active = false;
        };
    }, []);

    const categories = useMemo(
        () => [
            "All",
            ...new Set(
                gigs
                    .map((gig) => gig.category)
                    .filter(Boolean)
            ),
        ],
        [gigs]
    );

    const visibleGigs = useMemo(() => {
        const term = search.trim().toLowerCase();

        return gigs.filter((gig) => {
            const matchesCategory =
                category === "All" || gig.category === category;

            const matchesSearch =
                !term ||
                [gig.title, gig.description, gig.category, gig.freelancerName]
                    .some((value) =>
                        String(value || "").toLowerCase().includes(term)
                    );

            return matchesCategory && matchesSearch;
        });
    }, [gigs, search, category]);

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
            maximumFractionDigits: 0,
        }).format(Number(price) || 0);

    return (
        <>
            <ClientNavBar />

            <main className="details-page">
                <div className="page-container">
                    <div className="management-page-heading">
                        <div>
                            <h1>Browse Services</h1>
                            <p>
                                Discover services offered by HustleHub+
                                freelancers.
                            </p>
                        </div>
                    </div>

                    <div className="client-gigs-toolbar">
                        <div className="client-gigs-search">
                            <Search size={18} />

                            <input
                                type="search"
                                placeholder="Search services..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                aria-label="Search services"
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            aria-label="Filter by category"
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="status-box">
                            Loading available services...
                        </div>
                    ) : error ? (
                        <div className="error-box" role="alert">
                            {error}
                        </div>
                    ) : visibleGigs.length === 0 ? (
                        <div className="status-box">
                            <h2>No services found</h2>
                            <p>
                                Try a different search or category.
                            </p>
                        </div>
                    ) : (
                        <div className="client-gigs-grid">
                            {visibleGigs.map((gig) => (
                                <article
                                    className="client-gig-card"
                                    key={gig._id}
                                >
                                    <Link
                                        to={`/gigs/${gig._id}`}
                                        className="client-gig-image"
                                    >
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
                                    </Link>

                                    <div className="client-gig-card-content">
                                        <span className="category-pill">
                                            {gig.category || "General"}
                                        </span>

                                        <h2>
                                            <Link to={`/gigs/${gig._id}`}>
                                                {gig.title || "Untitled service"}
                                            </Link>
                                        </h2>

                                        <p>
                                            {gig.description
                                                ? `${gig.description.slice(0, 110)}${
                                                      gig.description.length > 110
                                                          ? "..."
                                                          : ""
                                                  }`
                                                : "Contact the freelancer for more information."}
                                        </p>

                                        <div className="client-gig-card-footer">
                                            <div>
                                                <small>Starting at</small>
                                                <strong>
                                                    {formatPrice(gig.price)}
                                                </strong>
                                            </div>

                                            <Link
                                                className="primary-button"
                                                to={`/gigs/${gig._id}`}
                                            >
                                                View Service
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
