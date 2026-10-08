import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';

import { loginUser } from '../services/authService';

import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ''
    }));

    setServerError('');
  };


  const validateForm = () => {
    const newErrors = {};

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email =
        'Email address is required.';
    }
    else if (
      !emailPattern.test(formData.email.trim())
    ) {
      newErrors.email =
        'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password =
        'Password is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }


    setServerError('');
    setIsSubmitting(true);


    try {

      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password
      });


      /*
        Stores authentication details for the
        current browser session.

        sessionStorage clears when the browser
        session ends.
      */
      sessionStorage.setItem(
        'hustlehubToken',
        response.token
      );

      sessionStorage.setItem(
        'hustlehubUser',
        JSON.stringify(response.user)
      );


      if (response.user.role === 'Client') {
        // Page 6
        navigate('/browse-services');
        return;
      }


      if (response.user.role === 'Freelancer') {
        navigate('/freelancer-dashboard');
        return;
      }


      setServerError(
        'Unable to determine the account role.'
      );

    } catch (error) {

      setServerError(
        error.message ||
        'Unable to login. Please try again.'
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  return (
    <AuthLayout>

      <section className="login-card">

        <div className="login-heading">
          <h1>Welcome back!</h1>

          <p>
            Login to your account
          </p>
        </div>


        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="loginEmail">
              Email Address
            </label>

            <input
              id="loginEmail"
              name="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              disabled={isSubmitting}
            />

            {errors.email && (
              <span
                className="login-error"
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </div>


          {/* Password */}
          <div className="login-form-group">

            <div className="login-password-heading">
              <label htmlFor="loginPassword">
                Password
              </label>
            </div>

            <div className="login-password-field">

              <input
                id="loginPassword"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                disabled={isSubmitting}
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                disabled={isSubmitting}
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

            {errors.password && (
              <span
                className="login-error"
                role="alert"
              >
                {errors.password}
              </span>
            )}

            <div className="forgot-password-row">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

          </div>


          {serverError && (
            <p
              className="login-server-error"
              role="alert"
            >
              {serverError}
            </p>
          )}


          {/* Login Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Logging in...'
              : 'Login'
            }
          </button>

        </form>


        <p className="login-register-text">
          Don't have an account?{' '}

          <Link to="/register">
            Register
          </Link>
        </p>

      </section>

    </AuthLayout>
  );
}

export default LoginPage;