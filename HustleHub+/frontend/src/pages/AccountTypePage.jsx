import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  UsersRound,
  BriefcaseBusiness,
  ArrowRight
} from 'lucide-react';

import AuthLayout from '../components/AuthLayout'; /* //(MDN Web Docs, 2026) */

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

  const registrationCompleted = useRef(false); /* //(MDN Web Docs, 2026) */


  useEffect(() => {
    if (
      !registrationData &&
      !registrationCompleted.current
    ) {
      navigate('/register', {
        replace: true
      });
    }
  }, [
    registrationData,
    navigate
  ]); /* //(MDN Web Docs, 2026) */


  const handleContinue = async () => {
    if (!selectedRole || isSubmitting) {
      return;
    }


    setServerError('');
    setIsSubmitting(true); /* //(MDN Web Docs, 2026) */


    try {

      const response = await registerUser({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
        role: selectedRole
      });

      registrationCompleted.current = true;


      setRegistrationData(null);


      if (selectedRole === 'Client') {
        // Page 6
        navigate('/browse-services', {
          replace: true
        });

        return;
      }


      if (selectedRole === 'Freelancer') {
        navigate('/freelancer/dashboard', {
          replace: true
        });

        return;
      } /* //(MDN Web Docs, 2026) */


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
        </div> {/* //(MDN Web Docs, 2026) */}


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
              setServerError(''); /* //(MDN Web Docs, 2026) */
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
            {serverError} {/* //(MDN Web Docs, 2026) */}
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

      {/* //(MDN Web Docs, 2026) */}

    </AuthLayout>
  );
}

export default AccountTypePage;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */