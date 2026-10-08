
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import "./styles/clientMarketplace.css";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AccountTypePage from "./pages/AccountTypePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage"; /* //(MDN Web Docs, 2026) */

import ClientHome from "./pages/ClientHome";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetails from "./pages/GigDetails";
import CreateBooking from "./pages/CreateBooking";
import BookingConfirmation from "./pages/BookingConfirmation"; /* (MDN Web Docs, 2026) */
import MyOrders from "./pages/MyOrders";
import Messages from "./pages/Messages";

import {
    getCurrentUser,
    isAuthenticated
} from "./services/authSession";

function MarketplaceLayout() {
    return (
        <div className="hh-marketplace">
            <Outlet />
        </div>
    );
}

function ClientRoute() {
    const location = useLocation();
    const user = getCurrentUser();

    if (!isAuthenticated() || !user) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location.pathname + location.search
                }}
                replace
            />
        );
    }

    const role = String(user.role || "")
        .trim()
        .toLowerCase();

    if (role !== "client") {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

// Allow visitors to browse services without logging in
function BrowseServicesRedirect() {
    return <Navigate to="/client/home" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public website pages */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/account-type"
                    element={<AccountTypePage />} /* //(MDN Web Docs, 2026) */
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />

                <Route
                    path="/how-it-works"
                    element={<HowItWorksPage />}
                />

                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                <Route
                    path="/browse-services"
                    element={<BrowseServicesRedirect />}
                />

                <Route element={<MarketplaceLayout />}>

                    <Route
                        path="/client/home"
                        element={<ClientHome />}
                    />

                    <Route
                        path="/gigs"
                        element={<BrowseGigs />}
                    />

                    <Route
                        path="/gigs/:id"
                        element={<GigDetails />}
                    />

                    <Route element={<ClientRoute />}>

                        <Route
                            path="/booking/:gigId"
                            element={<CreateBooking />} /* (MDN Web Docs, 2026) */
                        />

                        <Route
                            path="/booking/confirmation/:bookingId"
                            element={<BookingConfirmation />}
                        />

                        <Route
                            path="/client/orders"
                            element={<MyOrders />}
                        />

                        <Route
                            path="/client/messages"
                            element={<Messages />}
                        />

                    </Route>

                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App; /* //(MDN Web Docs, 2026) */

/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers.[online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026].
*/
