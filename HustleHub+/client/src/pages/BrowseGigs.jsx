
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import GigCard from "../components/GigCard";
import { getGigs } from "../services/api";

const categories = [
    "Graphic Design",
    "Web Development",
    "Digital Marketing",
    "Writing",
    "Video & Animation"
];

function BrowseGigs() {
    const [searchParams, setSearchParams] = useSearchParams();

    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";

    const [search, setSearch] = useState(urlSearch);
    const [category, setCategory] = useState(urlCategory);

    const [maxPrice, setMaxPrice] = useState(5000);
    const [deliveryTime, setDeliveryTime] = useState("");
    const [minRating, setMinRating] = useState("");
    const [sortBy, setSortBy] = useState("relevant");

    const [appliedFilters, setAppliedFilters] = useState({
        maxPrice: 5000,
        deliveryTime: "",
        minRating: ""
    });

    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setSearch(urlSearch);
        setCategory(urlCategory);
    }, [urlSearch, urlCategory]);

    useEffect(() => {
        let active = true;

        const loadGigs = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getGigs(
                    urlSearch,
                    urlCategory
                );

                if (active) {
                    setGigs(
                        Array.isArray(data.gigs)
                            ? data.gigs
                            : []
                    );
                }
            } catch (err) {
                if (active) {
                    setError(err.message);
                    setGigs([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadGigs();

        return () => {
            active = false;
        };
    }, [urlSearch, urlCategory]);

    const filteredGigs = useMemo(() => {
        const results = gigs.filter((gig) => {
            const price = Number(gig.price);
            const deliveryDays = Number(gig.deliveryDays);
            const rating = Number(gig.rating);

            const matchesPrice =
                Number.isFinite(price) &&
                price <= appliedFilters.maxPrice;

            const matchesDelivery =
                !appliedFilters.deliveryTime ||
                (
                    Number.isFinite(deliveryDays) &&
                    deliveryDays <=
                        Number(appliedFilters.deliveryTime)
                );

            const matchesRating =
                !appliedFilters.minRating ||
                (
                    Number.isFinite(rating) &&
                    rating >=
                        Number(appliedFilters.minRating)
                );

            return (
                matchesPrice &&
                matchesDelivery &&
                matchesRating
            );
        });

        if (sortBy === "newest") {
            results.sort((a, b) => {
                const dateA = new Date(
                    a.createdAt || 0
                ).getTime();

                const dateB = new Date(
                    b.createdAt || 0
                ).getTime();

                return dateB - dateA;
            });
        }

        if (sortBy === "price-low") {
            results.sort(
                (a, b) =>
                    Number(a.price) - Number(b.price)
            );
        }

        if (sortBy === "price-high") {
            results.sort(
                (a, b) =>
                    Number(b.price) - Number(a.price)
            );
        }

        return results;
    }, [gigs, appliedFilters, sortBy]);

    const applyFilters = (event) => {
        event.preventDefault();

        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (category) {
            params.category = category;
        }

        setAppliedFilters({
            maxPrice: Number(maxPrice),
            deliveryTime,
            minRating
        });

        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMaxPrice(5000);
        setDeliveryTime("");
        setMinRating("");
        setSortBy("relevant");

        setAppliedFilters({
            maxPrice: 5000,
            deliveryTime: "",
            minRating: ""
        });

        setSearchParams({});
    };

    return (
        <>
            <ClientNavbar />

            <main className="browse-page">
                <div className="page-container">

                    <div className="browse-heading">
                        <span className="section-label">
                            SEARCH RESULTS
                        </span>

                        <h1>
                            {urlSearch
                                ? `Results for "${urlSearch}"`
                                : "Browse Services"}
                        </h1>

                        <p>
                            {loading
                                ? "Searching services..."
                                : `${filteredGigs.length} service${
                                    filteredGigs.length === 1
                                        ? ""
                                        : "s"
                                } found`}
                        </p>
                    </div>

                    <div className="browse-layout">

                        <aside className="filter-panel">

                            <div className="filter-header">
                                <h3>Filters</h3>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </button>
                            </div>

                            <form onSubmit={applyFilters}>

                                <label
                                    className="field-label"
                                    htmlFor="gig-search"
                                >
                                    Search
                                </label>

                                <input
                                    id="gig-search"
                                    type="search"
                                    className="standard-input"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search services"
                                />

                                <div className="filter-group">
                                    <h4>Category</h4>

                                    <label className="radio-row">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={category === ""}
                                            onChange={() =>
                                                setCategory("")
                                            }
                                        />
                                        All Categories
                                    </label>

                                    {categories.map((item) => (
                                        <label
                                            className="radio-row"
                                            key={item}
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={category === item}
                                                onChange={() =>
                                                    setCategory(item)
                                                }
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>

                                <div className="filter-group">
                                    <h4>Maximum Price</h4>

                                    <p className="muted">
                                        {Number(maxPrice) === 5000
                                            ? "R5 000 or less"
                                            : `R${Number(maxPrice).toLocaleString()}`}
                                    </p>

                                    <input
                                        className="price-slider"
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="100"
                                        value={maxPrice}
                                        onChange={(event) =>
                                            setMaxPrice(
                                                Number(event.target.value)
                                            )
                                        }
                                        aria-label="Maximum price"
                                    />
                                </div>

                                <div className="filter-group">
                                    <h4>Minimum Rating</h4>

                                    <select
                                        className="standard-input"
                                        value={minRating}
                                        onChange={(event) =>
                                            setMinRating(event.target.value)
                                        }
                                    >
                                        <option value="">
                                            Any Rating
                                        </option>
                                        <option value="3">
                                            3 Stars and Up
                                        </option>
                                        <option value="4">
                                            4 Stars and Up
                                        </option>
                                        <option value="4.5">
                                            4.5 Stars and Up
                                        </option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <h4>Delivery Time</h4>

                                    <select
                                        className="standard-input"
                                        value={deliveryTime}
                                        onChange={(event) =>
                                            setDeliveryTime(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Any
                                        </option>
                                        <option value="3">
                                            Up to 3 days
                                        </option>
                                        <option value="7">
                                            Up to 7 days
                                        </option>
                                    </select>
                                </div>

                                <button
                                    className="primary-button full-width"
                                    type="submit"
                                >
                                    Apply Filters
                                </button>
                            </form>
                        </aside>

                        <section className="results-area">

                            <div className="results-toolbar">
                                <span>
                                    {filteredGigs.length} services
                                </span>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                    aria-label="Sort services"
                                >
                                    <option value="relevant">
                                        Most Relevant
                                    </option>
                                    <option value="newest">
                                        Newest
                                    </option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                </select>
                            </div>

                            {loading && (
                                <div className="status-box">
                                    Loading services...
                                </div>
                            )}

                            {error && (
                                <div className="error-box">
                                    {error}
                                </div>
                            )}

                            {!loading &&
                                !error &&
                                filteredGigs.length === 0 && (
                                    <div className="empty-state">
                                        <h3>No services found</h3>

                                        <p>
                                            Try another search,
                                            category, price range,
                                            rating or delivery time.
                                        </p>
                                    </div>
                                )}

                            {!loading && !error && (
                                <div className="gig-grid">
                                    {filteredGigs.map((gig) => (
                                        <GigCard
                                            key={gig._id}
                                            gig={gig}
                                        />
                                    ))}
                                </div>
                            )}

                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default BrowseGigs;
