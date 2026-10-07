import { NavLink, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import hustleHubLogo from '../assets/hustlehub-logo.png';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* HustleHub+ Logo */}
        <Link to="/" className="navbar-logo" aria-label="HustleHub home">
         <img
           src={hustleHubLogo}
           alt="HustleHub"
           className="navbar-logo-image"
        />
     </Link>

        {/* Main Navigation */}
        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Home
          </NavLink>

          {/* Page 6 */}
          <NavLink
            to="/browse-services"
            className="nav-link"
          >
            Browse Services
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            How It Works
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            About Us
          </NavLink>
        </nav>

        {/* Authentication Buttons */}
        <div className="navbar-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;