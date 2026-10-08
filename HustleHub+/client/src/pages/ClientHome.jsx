
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Palette,
    Code2,
    Megaphone,
    FilePenLine,
    Clapperboard
} from "lucide-react";

import ClientNavbar from "../components/ClientNavbar";

import GigCard
    from "../components/GigCard";

import {
    getGigs
} from "../services/api"; //(IIE, 2026)

const categories = [
    {
        name: "Graphic Design",
        icon: Palette
    },
    {
        name: "Web Development",
        icon: Code2
    },
    {
        name: "Digital Marketing",
        icon: Megaphone
    },
    {
        name: "Writing",
        icon: FilePenLine
    },
    {
        name: "Video & Animation",
        icon: Clapperboard
    }
];


function ClientHome() {

    const navigate =
        useNavigate();

    const [search, setSearch] =
        useState("");

    const [gigs, setGigs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadGigs = async () => {

            try {

                const data =
                    await getGigs();

                setGigs(
                    data.gigs.slice(0, 4)
                );

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        };

        loadGigs();

    }, []);


    const handleSearch = (event) => {

        event.preventDefault();

        if (!search.trim()) {
            navigate("/gigs");
            return;
        }

        navigate(
            `/gigs?search=${encodeURIComponent(
                search.trim()
            )}`
        );
    };


    const openCategory =
        (category) => {

            navigate(
                `/gigs?category=${encodeURIComponent(
                    category
                )}`
            );
        };


    return (
        <>
            <ClientNavbar />


            <main>

                <section className="hero">

                    <div className="hero-content">

                        <span className="eyebrow">
                            CONNECT. WORK. EARN.
                        </span>

                        <h1>
                            What service are you
                            looking for today?
                        </h1>

                        <p>
                            Discover talented
                            freelancers ready to
                            bring your ideas to life.
                        </p>


                        <form
                            className="hero-search"
                            onSubmit={
                                handleSearch
                            }
                        >

                            <span className="search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search for services..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <button type="submit">
                                Search
                            </button> {/* (MDN Web Docs, 2026) */}

                        </form>

                    </div>

                </section>


                <section className="content-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-label">
                                EXPLORE
                            </span> {/* (MDN Web Docs, 2026) */}

                            <h2>
                                Popular Categories
                            </h2>
                        </div>

                    </div>


                    <div className="category-grid">

                        {categories.map(
                            (category) => {
                                const Icon = category.icon;

                                return (
                                    // (MDN Web Docs, 2026)
                                    <button
                                        key={category.name}
                                        type="button"
                                        className="category-card"
                                        onClick={() =>
                                            openCategory(
                                                category.name
                                            )
                                        }
                                    >
                                        <span className="category-icon">
                                            <Icon
                                                size={28}
                                                strokeWidth={2}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        {category.name}
                                    </button>
                                );
                            }
                        )}

                    </div>

                </section>


                <section className="content-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                HANDPICKED
                            </span>

                            <h2>
                                Recommended for you
                            </h2>

                        </div>


                        <button
                            className="text-button"
                            onClick={() =>
                                navigate("/gigs")
                            }
                        >
                            View all →
                        </button>

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
                                No services yet
                            </h3>

                            <p>
                                Freelancer services
                                will appear here.
                            </p>

                        </div>
                    )}


                    <div className="gig-grid">

                        {gigs.map((gig) => (

                            <GigCard
                                key={gig._id}
                                gig={gig}
                            />

                        ))}

                    </div>

                </section>

            </main>
        </>
    );
}


export default ClientHome;

/*Reference List

MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 7 October 2026].

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of
Education: Unpublished.
*/
