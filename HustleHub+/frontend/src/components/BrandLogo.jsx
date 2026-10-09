import { Link } from 'react-router-dom';
import hustleHubLogo from '../assets/hustlehub-logo.png';
import '../styles/BrandLogo.css';

function BrandLogo() {
  return (
    <Link
      to="/"
      className="brand-logo-link"
      aria-label="HustleHub home"
    >
      <img
        src={hustleHubLogo}
        alt="HustleHub"
        className="brand-logo-image"
      />
    </Link>
  );
}

export default BrandLogo; /* //(MDN Web Docs, 2026) */


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */