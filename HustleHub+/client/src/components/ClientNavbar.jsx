
import { Link, NavLink } from "react-router-dom";

function ClientNavbar() {
    const getNavClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    return (
        <header className="client-navbar">
            <div className="navbar-inner">

                <Link
                    to="/client/home"
                    className="brand"
                >
                    <span className="brand-main">
                        HustleHub
                    </span>

                    <span className="brand-plus">
                        +
                    </span>
                </Link>

                <nav className="nav-links">

                    <NavLink
                        to="/client/home"
                        className={getNavClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/gigs"
                        className={getNavClass}
                    >
                        Browse Gigs
                    </NavLink>

                    <NavLink
                        to="/client/orders"
                        className={getNavClass}
                    >
                        My Orders
                    </NavLink>

                    <NavLink
                        to="/client/messages"
                        className={getNavClass}
                    >
                        Messages
                    </NavLink>

                </nav>

                <div className="nav-actions">

                    <button
                        className="nav-icon-button"
                        type="button"
                        aria-label="Notifications"
                        disabled
                        title="Notifications coming soon"
                    >
                        ♡
                    </button>

                    <div className="nav-avatar">
                        C
                    </div>

                </div>
            </div>
        </header>
    );
}

export default ClientNavbar;
