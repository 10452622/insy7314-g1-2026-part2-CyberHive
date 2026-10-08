import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  UsersRound,
  BriefcaseBusiness,
  ArrowRight
} from 'lucide-react';

import AuthLayout from '../components/AuthLayout';

import { useRegistration } from '../context/RegistrationContext';

import { registerUser } from '../services/authService';

import '../styles/AccountTypePage.css';

function AccountTypePage() {
  const navigate = useNavigate();

  const {
    registrationData,
    setRegistrationData
  } = useRegistration();

  const [selectedRole, setSelectedRole] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState('');


  useEffect(() => {
    if (!registrationData) {
      navigate('/register');
    }
  }, [registrationData, navigate]);


  const handleContinue = async () => {
    if (!selectedRole || isSubmitting) {
      return;
    }


    setServerError('');
    setIsSubmitting(true);


    try {

      const response = await registerUser({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
        role: selectedRole
      });


      /*
        Removes the password from frontend memory once registration has succeeded.
      */
      setRegistrationData({
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      });


      if (selectedRole === 'Client') {
        // Page 6
        navigate('/browse-services');
        return;
      }


      if (selectedRole === 'Freelancer') {
        navigate('/freelancer-dashboard');
      }

    } catch (error) {

      setServerError(
        error.message ||
        'Unable to create your account. Please try again.'
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  if (!registrationData) {
    return null;
  }


  return (
    <AuthLayout>

      <section className="account-type-container">

        <div className="account-type-heading">
          <h1>
            How do you want to use
            <span> HustleHub+?</span>
          </h1>

          <p>
            Choose the option that best describes you.
          </p>
        </div>


        <div className="account-type-options">

          {/* Freelancer */}
          <button
            type="button"
            className={
              selectedRole === 'Freelancer'
                ? 'account-type-card selected'
                : 'account-type-card'
            }
            onClick={() => {
              setSelectedRole('Freelancer');
              setServerError('');
            }}
            disabled={isSubmitting}
          >
            <div className="account-type-icon">
              <BriefcaseBusiness
                size={42}
                strokeWidth={1.8}
              />
            </div>

            <h2>I'm a Freelancer</h2>

            <p>
              I want to offer my skills and services
              to clients.
            </p>

            <span className="account-type-check">
              {selectedRole === 'Freelancer' ? '✓' : ''}
            </span>
          </button>


          {/* Client */}
          <button
            type="button"
            className={
              selectedRole === 'Client'
                ? 'account-type-card selected'
                : 'account-type-card'
            }
            onClick={() => {
              setSelectedRole('Client');
              setServerError('');
            }}
            disabled={isSubmitting}
          >
            <div className="account-type-icon">
              <UsersRound
                size={42}
                strokeWidth={1.8}
              />
            </div>

            <h2>I'm a Client</h2>

            <p>
              I want to find and book services
              from freelancers.
            </p>

            <span className="account-type-check">
              {selectedRole === 'Client' ? '✓' : ''}
            </span>
          </button>

        </div>


        {serverError && (
          <p
            className="account-type-error"
            role="alert"
          >
            {serverError}
          </p>
        )}


        <button
          type="button"
          className="account-type-continue"
          disabled={!selectedRole || isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting
            ? 'Creating account...'
            : 'Continue'
          }

          {!isSubmitting && (
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          )}
        </button>


        <button
          type="button"
          className="account-type-back"
          onClick={() => navigate('/register')}
          disabled={isSubmitting}
        >
          Back to registration
        </button>

      </section>

    </AuthLayout>
  );
}

export default AccountTypePage;