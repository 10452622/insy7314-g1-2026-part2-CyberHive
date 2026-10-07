import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';

import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

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
  };

  const validateForm = () => {
    const newErrors = {};

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email ='Email address is required.';
    } 
    else if 
    (!emailPattern.test(formData.email.trim())) {
      newErrors.email ='Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password =
        'Password is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Login form validated:', {
      email: formData.email
    });
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
            />

            {errors.email && (
              <span className="login-error">
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
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

            {errors.password && (
              <span className="login-error">
                {errors.password}
              </span>
            )}

            <div className="forgot-password-row">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="login-submit-btn"
          >
            Login
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