import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';

import '../styles/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = () => {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    }

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setSubmitted(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (error) {
      setError('');
    }
  };

  return (
    <AuthLayout>

      <section className="forgot-card">

        {!submitted ? (
          <>
            <div className="forgot-heading">

              <div className="forgot-icon">
                <Mail
                  size={30}
                  strokeWidth={1.8}
                />
              </div>

              <h1>
                Forgot your password?
              </h1>

              <p>
                Enter your email address and
                we'll send you a link to reset
                your password.
              </p>

            </div>

            <form
              className="forgot-form"
              onSubmit={handleSubmit}
              noValidate
            >

              <div className="forgot-form-group">

                <label htmlFor="resetEmail">
                  Email Address
                </label>

                <input
                  id="resetEmail"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={Boolean(error)}
                />

                {error && (
                  <span className="forgot-error">
                    {error}
                  </span>
                )}

              </div>

              <button
                type="submit"
                className="forgot-submit-btn"
              >
                Send Reset Link
              </button>

            </form>
          </>
        ) : (
          <div className="forgot-success">

            <div className="success-icon">
              ✓
            </div>

            <h1>
              Check your email
            </h1>

            <p>
              If an account exists for
              <strong> {email}</strong>, a password
              reset link has been sent.
            </p>

            <button
              type="button"
              className="send-again-btn"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </button>

          </div>
        )}

        <Link
          to="/login"
          className="back-login-link"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
          />

          Back to Login
        </Link>

      </section>

    </AuthLayout>
  );
}

export default ForgotPasswordPage;