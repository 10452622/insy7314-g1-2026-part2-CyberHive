import { getCurrentUser } from "../services/authSession";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authSession";

function ClientNavbar() {
    const navigate = useNavigate();

    const user = getCurrentUser();

    const firstName = String(
        user?.firstName ||
        user?.name ||
        user?.username ||
        ""
    ).trim();

    const initial = firstName
        ? firstName.charAt(0).toUpperCase()
        : "?";
        
        const getNavClass = ({ isActive }) =>
            isActive ? "nav-link active" : "nav-link";

    const handleLogout = () => {
        // Clear the current user's login session
        logout();

        // Return to the public homepage
        navigate("/", { replace: true });
    };

    return (
        <header className="client-navbar">
            <div className="navbar-inner">

                <Link
                    to="/"
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
                      {initial}
                   </div>

                    <button
                        type="button"
                        className="client-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </header>
    );
}

export default ClientNavbar;
