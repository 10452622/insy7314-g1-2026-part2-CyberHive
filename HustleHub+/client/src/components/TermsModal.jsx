import { useEffect } from 'react';
import { X } from 'lucide-react';

import '../styles/TermsModal.css';

function TermsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return; /* //(MDN Web Docs, 2026) */
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null; /* //(MDN Web Docs, 2026) */
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="terms-overlay"
      onClick={handleBackdropClick}
    >
      <div
        className="terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >

        <div className="terms-modal-header">
          <div>
            <span className="terms-modal-tag"> {/* //(MDN Web Docs, 2026) */}
              HUSTLEHUB+
            </span>

            <h2 id="terms-title">
              Terms & Conditions
            </h2>
          </div>

          <button
            type="button"
            className="terms-close-button"
            onClick={onClose}
            aria-label="Close Terms and Conditions"
          >
            <X size={22} />
          </button>
        </div>

        <div className="terms-modal-content">

          <p className="terms-intro">
            By creating and using a HustleHub+ account,
            you agree to use the marketplace responsibly
            and in accordance with these terms. {/* //(MDN Web Docs, 2026) */}
          </p>

          <section>
            <h3>1. Account Information</h3>

            <p>
              Users must provide accurate information when
              registering and are responsible for keeping
              their login details secure.
            </p>
          </section>

          <section>
            <h3>2. Account Roles</h3>

            <p>
              HustleHub+ provides Client and Freelancer
              account types. Access to features and data may
              differ depending on the role associated with
              the account.
            </p>
          </section>

          <section>
            <h3>3. Freelancer Services</h3>

            <p>
              Freelancers are responsible for ensuring that
              their service listings, descriptions and other
              information are accurate and appropriate. {/* //(MDN Web Docs, 2026) */}
            </p>
          </section>

          <section>
            <h3>4. Bookings</h3>

            <p>
              Clients may browse available services and make
              bookings through the platform. For this academic
              version of HustleHub+, booking confirmation is
              simulated and no real payment is processed.
            </p>
          </section>

          <section>
            <h3>5. Authorised Access</h3>

            <p>
              Users may only access information and perform
              actions that their account role permits. Users
              must not attempt to access, modify or delete
              another user's protected resources.
            </p>
          </section> {/* //(MDN Web Docs, 2026) */}

          <section>
            <h3>6. Acceptable Use</h3>

            <p>
              HustleHub+ must not be used for fraudulent,
              abusive, unlawful or harmful activity, or for
              attempts to interfere with the security or
              operation of the platform.
            </p>
          </section>

          <section>
            <h3>7. Security</h3>

            <p>
              HustleHub+ uses authentication, access controls
              and input-handling measures to help protect
              user and marketplace information. Users are also
              responsible for protecting their own account
              credentials.
            </p>
          </section>

          <section>
            <h3>8. Agreement</h3>

            <p>
              By selecting the agreement checkbox during
              registration, you confirm that you have read
              and accepted these Terms & Conditions.
            </p>
          </section>

        </div>

        <div className="terms-modal-footer">
          <button
            type="button"
            className="terms-understand-button"
            onClick={onClose}
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  ); /* //(MDN Web Docs, 2026) */
}

export default TermsModal;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */