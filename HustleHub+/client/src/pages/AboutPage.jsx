import { Link } from 'react-router-dom';

import {
  UsersRound,
  BriefcaseBusiness,
  ShieldCheck,
  Handshake,
  ArrowRight
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../styles/AboutPage.css';


function AboutPage() {
  return (
    <div className="about-page">

      <Navbar />

      <main>

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-content">

            <span className="about-eyebrow">
              ABOUT HUSTLEHUB+
            </span>

            <h1>
              Connecting skills with
              <span> opportunity.</span>
            </h1>

            <p>
              HustleHub+ is a freelance marketplace designed
              to connect talented freelancers with clients
              looking for professional services.
            </p>

          </div>

        </section>


        {/* OUR PURPOSE */}
        <section className="about-purpose">

          <div className="about-container">

            <div className="purpose-layout">

              <div className="purpose-heading">

                <span>
                  OUR PURPOSE
                </span>

                <h2>
                  Making freelance work simpler for everyone
                </h2>

              </div>


              <div className="purpose-content">

                <p>
                  HustleHub+ provides a central marketplace where
                  freelancers can advertise their skills and services,
                  while clients can browse available gigs and make
                  bookings that match their needs.
                </p>

                <p>
                  The platform is designed to make the process of
                  finding talent, managing services and tracking
                  freelance activity clear, organised and accessible.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* WHAT WE PROVIDE */}
        <section className="about-services">

          <div className="about-container">

            <div className="about-section-heading">

              <span>
                WHAT HUSTLEHUB+ PROVIDES
              </span>

              <h2>
                Built for both sides of the marketplace
              </h2>

              <p>
                Whether you're looking for talent or offering
                your own skills, HustleHub+ gives you a place
                to manage the process.
              </p>

            </div>


            <div className="about-card-grid">

              <article className="about-info-card">

                <div className="about-card-icon">
                  <UsersRound
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h3>
                  For Clients
                </h3>

                <p>
                  Browse freelancer services, review available
                  gigs, make bookings and keep track of your
                  orders from one platform.
                </p>

              </article>


              <article className="about-info-card">

                <div className="about-card-icon">
                  <BriefcaseBusiness
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h3>
                  For Freelancers
                </h3>

                <p>
                  Create and manage service listings, receive
                  bookings from clients and monitor the income
                  generated through completed work.
                </p>

              </article>


              <article className="about-info-card">

                <div className="about-card-icon">
                  <Handshake
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h3>
                  One Marketplace
                </h3>

                <p>
                  HustleHub+ brings clients and freelancers
                  together through one structured and simple
                  digital marketplace.
                </p>

              </article>

            </div>

          </div>

        </section>


        {/* SECURITY */}
        <section className="about-security">

          <div className="about-security-container">

            <div className="about-security-icon">
              <ShieldCheck
                size={38}
                strokeWidth={1.8}
              />
            </div>


            <div className="about-security-content">

              <span>
                SECURITY FIRST
              </span>

              <h2>
                Designed with secure access in mind
              </h2>

              <p>
                HustleHub+ handles user credentials, bookings,
                transaction information and income-related data.
                The platform therefore uses authentication,
                role-based access control and secure handling of
                user information as core parts of its design.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="about-cta">

          <div className="about-cta-content">

            <h2>
              Find skills. Share skills. Get things done.
            </h2>

            <p>
              Create your HustleHub+ account and choose how
              you want to use the marketplace.
            </p>

            <div className="about-cta-actions">

              <Link
                to="/register"
                className="about-primary-btn"
              >
                Join HustleHub+

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                />
              </Link>


              {/* Page 6 */}
              <Link
                to="/browse-services"
                className="about-secondary-btn"
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


export default AboutPage;