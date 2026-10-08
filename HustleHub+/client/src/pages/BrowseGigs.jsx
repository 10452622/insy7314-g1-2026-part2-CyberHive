import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import Navbar
    from "../components/Navbar";

import GigCard
    from "../components/GigCard";

import {
    getGigs
} from "../services/api";


const categories = [
    "Graphic Design",
    "Web Development",
    "Digital Marketing",
    "Writing",
    "Video & Animation"
];


function BrowseGigs() {

    const [searchParams,
        setSearchParams] =
        useSearchParams();


    const initialSearch =
        searchParams.get("search") || "";

    const initialCategory =
        searchParams.get("category") || "";


    const [search, setSearch] =
        useState(initialSearch);

    const [category, setCategory] =
        useState(initialCategory);

    const [gigs, setGigs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadGigs = async () => {

            setLoading(true);
            setError("");

            try {

                const data =
                    await getGigs(
                        initialSearch,
                        initialCategory
                    );

                setGigs(data.gigs);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        loadGigs();

    }, [
        initialSearch,
        initialCategory
    ]);


    const applyFilters = (event) => {

        event.preventDefault();

        const params = {};

        if (search.trim()) {
            params.search =
                search.trim();
        }

        if (category) {
            params.category =
                category;
        }

        setSearchParams(params);
    };


    const clearFilters = () => {

        setSearch("");
        setCategory("");
        setSearchParams({});
    };


    return (
        <>
            <Navbar />


            <main className="browse-page">

                <div className="page-container">

                    <div className="browse-heading">

                        <span className="section-label">
                            SEARCH RESULTS
                        </span>

                        <h1>
                            {initialSearch
                                ? `Results for "${initialSearch}"`
                                : "Browse Services"}
                        </h1>

                        <p>
                            {gigs.length} service
                            {gigs.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>

                    </div>


                    <div className="browse-layout">

                        <aside className="filter-panel">

                            <div className="filter-header">

                                <h3>
                                    Filters
                                </h3>

                                <button
                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    applyFilters
                                }
                            >

                                <label className="field-label">
                                    Search
                                </label>

                                <input
                                    className="standard-input"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search services"
                                />


                                <div className="filter-group">

                                    <h4>
                                        Category
                                    </h4>

                                    {categories.map(
                                        (item) => (

                                            <label
                                                className="radio-row"
                                                key={item}
                                            >

                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={
                                                        category ===
                                                        item
                                                    }
                                                    onChange={() =>
                                                        setCategory(
                                                            item
                                                        )
                                                    }
                                                />

                                                {item}

                                            </label>

                                        )
                                    )}

                                </div>


                                <div className="filter-group">

                                    <h4>
                                        Price
                                    </h4>

                                    <p className="muted">
                                        R0 – R5 000+
                                    </p>

                                    <input
                                        className="price-slider"
                                        type="range"
                                        min="0"
                                        max="5000"
                                        defaultValue="5000"
                                    />

                                </div>


                                <div className="filter-group">

                                    <h4>
                                        Rating
                                    </h4>

                                    <div className="rating">
                                        ★★★★★
                                    </div>

                                </div>


                                <div className="filter-group">

                                    <h4>
                                        Delivery Time
                                    </h4>

                                    <select className="standard-input">
                                        <option>
                                            Any
                                        </option>
                                        <option>
                                            Up to 3 days
                                        </option>
                                        <option>
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
                                    {gigs.length} services
                                </span>

                                <select>
                                    <option>
                                        Most Relevant
                                    </option>
                                    <option>
                                        Newest
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
                                gigs.length === 0 && (

                                <div className="empty-state">

                                    <h3>
                                        No services found
                                    </h3>

                                    <p>
                                        Try another
                                        search or category.
                                    </p>

                                </div>
                            )}


                            <div className="gig-grid">

                                {gigs.map(
                                    (gig) => (

                                        <GigCard
                                            key={
                                                gig._id
                                            }
                                            gig={gig}
                                        />

                                    )
                                )}

                            </div>

                        </section>

                    </div>

                </div>

            </main>
        </>
    );
}


export default BrowseGigs;