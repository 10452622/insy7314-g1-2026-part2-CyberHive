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
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>

          {/* Page 6 belongs to another teammate */}
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
          © 2026 HustleHub+. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;