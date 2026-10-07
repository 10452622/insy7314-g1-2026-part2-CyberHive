import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Remove the error while the user corrects the field
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const namePattern = /^[A-Za-zÀ-ÿ' -]+$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName =
        'First name must contain at least 2 characters.';
    } else if (!namePattern.test(formData.firstName.trim())) {
      newErrors.firstName =
        'Please enter a valid first name.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName =
        'Last name must contain at least 2 characters.';
    } else if (!namePattern.test(formData.lastName.trim())) {
      newErrors.lastName =
        'Please enter a valid last name.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email =
        'Please enter a valid email address.';
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, a number and a special character.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        'Please confirm your password.';
    } else if (
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted =
        'You must accept the Terms & Conditions.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Page 3 - Choose Account Type
    navigate('/account-type');
  };

  return (
    <AuthLayout>
      <section className="register-card">

        <div className="register-heading">
          <h1>Create your account</h1>

          <p>Join HustleHub+ today</p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="name-fields">

            <div className="form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.firstName)}
              />

              {errors.firstName && (
                <span className="form-error">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.lastName)}
              />

              {errors.lastName && (
                <span className="form-error">
                  {errors.lastName}
                </span>
              )}
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />

            {errors.email && (
              <span className="form-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
              />

              <button
                type="button"
                className="password-toggle"
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
              <span className="form-error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-field">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={
                  Boolean(errors.confirmPassword)
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirmation password'
                    : 'Show confirmation password'
                }
              >
                {showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="form-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div>
            <label className="terms-row">

              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />

              <span>
                I agree to the{' '}
                <a href="#terms">
                  Terms & Conditions
                </a>
              </span>

            </label>

            {errors.termsAccepted && (
              <span className="form-error terms-error">
                {errors.termsAccepted}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="register-submit-btn"
          >
            Continue
          </button>

        </form>

        <p className="register-login-text">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </p>

      </section>
    </AuthLayout>
  );
}

export default RegisterPage;