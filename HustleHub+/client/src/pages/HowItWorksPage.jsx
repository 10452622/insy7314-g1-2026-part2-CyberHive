import { Link } from 'react-router-dom';

import {
  UserPlus,
  Search,
  CalendarCheck,
  ClipboardCheck,
  BriefcaseBusiness,
  PlusCircle,
  BellRing,
  CircleDollarSign,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../styles/HowItWorksPage.css';


const clientSteps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    description:'Register on HustleHub+ and choose Client as your account type.'
  },
  {
    icon: Search,
    title: 'Browse services',
    description:'Explore professional services offered by talented freelancers.'
  },
  {
    icon: BriefcaseBusiness,
    title: 'Choose a freelancer',
    description:'Review services and select the freelancer that suits your needs.'
  },
  {
    icon: CalendarCheck,
    title: 'Book a service',
    description:'Provide your requirements and submit your booking.'
  },
  {
    icon: ClipboardCheck,
    title: 'Track your order',
    description:'View your bookings and follow the progress of your service.'
  }
];


const freelancerSteps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    description:'Register and select Freelancer as your HustleHub+ account type.'
  },
  {
    icon: PlusCircle,
    title: 'Create your gigs',
    description:'List your skills, services, pricing and what you can offer clients.'
  },
  {
    icon: BellRing,
    title: 'Receive bookings',
    description:'View new bookings from clients interested in your services.'
  },
  {
    icon: ClipboardCheck,
    title: 'Complete the work',
    description:'Deliver the requested service according to the client requirements.'
  },
  {
    icon: CircleDollarSign,
    title: 'Track your earnings',
    description:'View income generated from your completed HustleHub+ bookings.'
  }
];


function HowItWorksPage() {
  return (
    <div className="how-page">

      <Navbar />

      <main>

        {/* Hero */}
        <section className="how-hero">
          <div className="how-hero-content">

            <span className="how-eyebrow">
              HOW HUSTLEHUB+ WORKS
            </span>

            <h1>
              From finding talent to getting
              <span> work done.</span>
            </h1>

            <p>
              HustleHub+ connects clients with skilled freelancers
              through a simple and secure marketplace.
            </p>

          </div>
        </section>


        {/* Client Process */}
        <section className="how-section">

          <div className="how-container">

            <div className="how-section-heading">
              <span>FOR CLIENTS</span>

              <h2>
                Find the right service in a few simple steps
              </h2>

              <p>
                Discover talent, make a booking and manage your
                services from one place.
              </p>
            </div>


            <div className="steps-grid">

              {clientSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    className="step-card"
                    key={step.title}
                  >

                    <span className="step-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="step-icon">
                      <Icon
                        size={26}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                  </article>
                );
              })}

            </div>

          </div>

        </section>


        {/* Freelancer Process */}
        <section className="how-section freelancer-process">

          <div className="how-container">

            <div className="how-section-heading">
              <span>FOR FREELANCERS</span>

              <h2>
                Turn your skills into opportunities
              </h2>

              <p>
                Create services, connect with clients and track
                the income you generate.
              </p>
            </div>


            <div className="steps-grid">

              {freelancerSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    className="step-card"
                    key={step.title}
                  >

                    <span className="step-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="step-icon">
                      <Icon
                        size={26}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                  </article>
                );
              })}

            </div>

          </div>

        </section>


        {/* Security */}
        <section className="how-security">

          <div className="how-security-container">

            <div className="security-icon">
              <ShieldCheck
                size={34}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span>BUILT WITH SECURITY IN MIND</span>

              <h2>
                A marketplace designed around secure access
              </h2>

              <p>
                HustleHub+ protects account and marketplace
                functionality through authenticated access,
                role-based permissions and secure handling
                of user information.
              </p>
            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="how-cta">

          <div className="how-cta-content">

            <h2>
              Ready to get started?
            </h2>

            <p>
              Join HustleHub+ and choose how you want to use
              the marketplace.
            </p>

            <div className="how-cta-actions">

              <Link
                to="/register"
                className="how-primary-btn"
              >
                Create an Account

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                />
              </Link>

              {/* Page 6 */}
              <Link
                to="/browse-services"
                className="how-secondary-btn"
              >
                Browse Services
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}


export default HowItWorksPage;