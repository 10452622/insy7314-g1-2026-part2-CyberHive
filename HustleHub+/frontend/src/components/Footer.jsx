import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>
            HustleHub<span>+</span>
          </h2>

          <p>
            Connect. Work. Earn.
          </p>
    </div> {/* //(MDN Web Docs, 2026) */}

        <div className="footer-links">
          <Link to="/">Home</Link>

          {/* Page 6 */}
          <Link to="/browse-services">
            Browse Services
          </Link>

          <Link to="/how-it-works">
            How It Works
          </Link>

          <Link to="/about">
            About Us
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 HustleHub+. All rights reserved. {/* //(MDN Web Docs, 2026) */}
        </p>
      </div>
    </footer>
  );
}

export default Footer;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */