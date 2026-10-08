import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import '../styles/Navbar.css';
import BrandLogo from './BrandLogo';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* HustleHub+ Logo */}
        <BrandLogo />


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
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
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
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="register-btn"
          >
            Register
          </Link>
        </div>


        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() =>
            setMobileMenuOpen((previousState) => !previousState)
          }
          aria-label={
            mobileMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen
            ? <X size={28} />
            : <Menu size={28} />
          }
        </button>

      </div>


      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={
          mobileMenuOpen
            ? 'mobile-menu open'
            : 'mobile-menu'
        }
      >
        <nav className="mobile-menu-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          {/* Page 6 */}
          <NavLink
            to="/browse-services"
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
            onClick={closeMobileMenu}
          >
            Browse Services
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
            onClick={closeMobileMenu}
          >
            How It Works
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
            onClick={closeMobileMenu}
          >
            About Us
          </NavLink>

        </nav>


        <div className="mobile-menu-actions">

          <Link
            to="/login"
            className="mobile-login-btn"
            onClick={closeMobileMenu}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="mobile-register-btn"
            onClick={closeMobileMenu}
          >
            Register
          </Link>

        </div>
      </div>

    </header>
  );
}

export default Navbar;