import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountTypePage from './pages/AccountTypePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage'; /* //(MDN Web Docs, 2026) */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App; /* //(MDN Web Docs, 2026) */


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */