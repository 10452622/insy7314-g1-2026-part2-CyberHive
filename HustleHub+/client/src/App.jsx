import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountTypePage from './pages/AccountTypePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

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
          element={<AccountTypePage />}
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

export default App;