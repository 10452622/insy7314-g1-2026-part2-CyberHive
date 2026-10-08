import BrandLogo from './BrandLogo';
import '../styles/AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-page">

      <header className="auth-header">

        <BrandLogo />

      </header>

      <main className="auth-main">
        {children}
      </main>

    </div>
  );  /* //(MDN Web Docs, 2026) */
}

export default AuthLayout;

/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */