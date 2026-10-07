import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  UserRound,
  BriefcaseBusiness,
  ArrowRight
} from 'lucide-react';

import AuthLayout from '../components/AuthLayout';

import { useRegistration } from '../context/RegistrationContext';

import '../styles/AccountTypePage.css';

function AccountTypePage() {
  const navigate = useNavigate();

  const {
    registrationData,
    setRegistrationData
  } = useRegistration();

  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (!registrationData) {
      navigate('/register');
    }
  }, [registrationData, navigate]);

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    setRegistrationData((previousData) => ({
      ...previousData,
      role: selectedRole
    }));

    if (selectedRole === 'client') {
      // Page 6 
      navigate('/browse-services');
      return;
    }

    if (selectedRole === 'freelancer') {
      navigate('/freelancer-dashboard');
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
              selectedRole === 'freelancer'
                ? 'account-type-card selected'
                : 'account-type-card'
            }
            onClick={() => setSelectedRole('freelancer')}
          >
            <div className="account-type-icon">
              <UserRound
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
              {selectedRole === 'freelancer' ? '✓' : ''}
            </span>
          </button>


          {/* Client */}
          <button
            type="button"
            className={
              selectedRole === 'client'
                ? 'account-type-card selected'
                : 'account-type-card'
            }
            onClick={() => setSelectedRole('client')}
          >
            <div className="account-type-icon">
              <BriefcaseBusiness
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
              {selectedRole === 'client' ? '✓' : ''}
            </span>
          </button>

        </div>

        <button
          type="button"
          className="account-type-continue"
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue

          <ArrowRight
            size={18}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          className="account-type-back"
          onClick={() => navigate('/register')}
        >
          Back to registration
        </button>

      </section>

    </AuthLayout>
  );
}

export default AccountTypePage;