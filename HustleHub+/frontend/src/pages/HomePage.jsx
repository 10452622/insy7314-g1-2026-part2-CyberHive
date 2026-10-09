import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PopularCategories from '../components/PopularCategories';
import Footer from '../components/Footer';
import heroImage from '../assets/hero.png';
import '../styles/HomePage.css'; /* //(MDN Web Docs, 2026) */


function HomePage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-container">

            {/* Left side */}
            <div className="hero-content">
              <span className="hero-tag">FREELANCE MARKETPLACE</span>

              <h1 className="hero-title">
                Find Skills.
                <br />
                Hire Talent.
                <br />
                Get Things <span>Done.</span>
              </h1>

              <p className="hero-description">
                Connect with talented freelancers, discover professional
                services, and bring your ideas to life with HustleHub+. {/* //(MDN Web Docs, 2026) */}
              </p>

              <div className="hero-actions">
                {/* Page 6 */}
                <Link
                  to="/browse-services"
                  className="hero-primary-btn"
                >
                  Find a Freelancer
                </Link>

                <Link
                  to="/register"
                  className="hero-secondary-btn"
                >
                  Become a Freelancer
                </Link>
              </div>

              <div className="hero-trust">
                <div>
                  <strong>Skilled</strong>
                  <span>Freelancers</span>
                </div>

                <div className="trust-divider"></div>

                <div>
                  <strong>Secure</strong>
                  <span>Marketplace</span>
                </div>

              <div className="trust-divider"></div> {/* //(MDN Web Docs, 2026) */}

                <div>
                  <strong>Simple</strong>
                  <span>Bookings</span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="hero-media">
              <div className="hero-video-wrapper">
                <video
                  className="hero-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={heroImage}
                >
                  <source
                    src="/videos/hustlehub-hero.mp4"/* //(Pexels, 2026) */
                    type="video/mp4"
                  />
                </video>

                <div className="hero-floating-card">
                  <span className="floating-dot"></span>

                  <div>
                    <strong>Find the right talent</strong>
                    <p>For any project.</p>
                  </div>
                </div>
              </div>

              <div className="hero-decoration hero-decoration-one"></div>
              <div className="hero-decoration hero-decoration-two"></div> {/* //(MDN Web Docs, 2026) */}
            </div>

          </div>
        </section>

         {/* Popular Categories */}
        <PopularCategories />

      </main>\

      <Footer />

    </div>
  );
}

export default HomePage;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. 
    2. Pexels, 2026. The best free stock photos, royalty free images & videos shared by creators. [online] Available at: <https://www.pexels.com/> [Accessed 8 October 2026]. */
