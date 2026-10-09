import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import '../styles/Navbar.css';
import BrandLogo from './BrandLogo'; {/* //(MDN Web Docs, 2026) */}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* HustleHub+ Logo */}
        <BrandLogo /> {/* //(MDN Web Docs, 2026) */}



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
            } /* //(MDN Web Docs, 2026) */
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
        </nav> {/* //(MDN Web Docs, 2026) */}


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
          } {/* //(MDN Web Docs, 2026) */}
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
            onClick={closeMobileMenu} /* //(MDN Web Docs, 2026) */
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
          </NavLink> {/* //(MDN Web Docs, 2026) */}

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

        </nav> {/* //(MDN Web Docs, 2026) */}


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

    </header> /* //(MDN Web Docs, 2026) */
  );
}

export default Navbar;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */