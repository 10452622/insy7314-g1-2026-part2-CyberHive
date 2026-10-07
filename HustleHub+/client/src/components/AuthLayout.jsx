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
  );
}

export default AuthLayout;