import { Link } from 'react-router-dom';

import {
  Palette,
  Code2,
  FilePenLine,
  Megaphone,
  Clapperboard,
  Music2,
  ArrowRight
} from 'lucide-react';

import '../styles/PopularCategories.css'; /* //(MDN Web Docs, 2026) */

const categories = [
  {
    name: 'Design & Creative',
    icon: Palette,
    description: 'Bring ideas to life'
  },

  {
    name: 'Web Development',
    icon: Code2,
    description: 'Build your digital presence' /* //(MDN Web Docs, 2026) */
  },

  {
    name: 'Writing & Translation',
    icon: FilePenLine,
    description: 'Words that make an impact'
  },

  {
    name: 'Marketing & SEO',
    icon: Megaphone,
    description: 'Grow your business'
  },

  {
    name: 'Video & Animation',
    icon: Clapperboard,
    description: 'Create engaging content'
  },

  {
    name: 'Music & Audio',
    icon: Music2,
    description: 'Find your perfect sound' /* //(MDN Web Docs, 2026) */
  }
];

function PopularCategories() {
  return (
    <section className="categories-section">
      <div className="categories-container">

        {/* Section Heading */}
        <div className="categories-header">

          <span className="categories-tag"> {/* //(MDN Web Docs, 2026) */}
            EXPLORE HUSTLEHUB+
          </span>

          <h2>
            Popular Categories
          </h2>

          <p>
            Discover professional services from talented freelancers.
          </p>

        </div>

        {/* Category Cards */}
        <div className="categories-grid">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                to="/browse-services"
                className="category-card"
                key={category.name}
              >

                <div className="category-icon">
                  <Icon
                    size={28}
                    strokeWidth={2}
                    aria-hidden="true" /* //(MDN Web Docs, 2026) */
                  />
                </div>

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description}
                </p>

                <span className="category-arrow">
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                  />
                </span>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default PopularCategories;


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */
