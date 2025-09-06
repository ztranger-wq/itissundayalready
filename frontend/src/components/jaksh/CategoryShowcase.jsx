import { useState } from 'react';
import './CategoryShowcase.css';

const CategoryShowcase = ({ categories, activeCategory, setActiveCategory }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categoryData = {
    'Badges & Recognition': {
      description: 'Professional badges and recognition items for corporate and institutional use',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      products: ['Metal Badges', 'Plastic Badges', 'Magnetic Name Tags'],
      color: '#3b82f6'
    },
    'Corporate & Promotional Merchandise': {
      description: 'Complete corporate branding solutions and promotional items',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      products: ['Custom Drinkware', 'Employee Welcome Kits', 'Promotional T-shirts'],
      color: '#10b981'
    },
    'Event & Branding Solutions': {
      description: 'Professional event management and branding materials',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      products: ['Event Passes', 'Customized Wristbands', 'Branding Materials'],
      color: '#f59e0b'
    },
    'School & Institutional Solutions': {
      description: 'Comprehensive solutions for educational institutions',
      image: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400',
      products: ['Student ID Cards', 'Award Ribbons', 'Institutional Badges'],
      color: '#8b5cf6'
    },
    'Packaging & Gifting': {
      description: 'Premium packaging and corporate gifting solutions',
      image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
      products: ['Corporate Gift Sets', 'Custom Packaging', 'Premium Wrapping'],
      color: '#ef4444'
    }
  };

  return (
    <section className="category-showcase">
      <div className="showcase-header">
        <h2>Explore Our Categories</h2>
        <p>Discover specialized solutions for every business need</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((category) => {
          const data = categoryData[category];
          if (!data) return null;
          
          return (
            <div
              key={category}
              className={`category-showcase-card ${activeCategory === category ? 'active' : ''}`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => setActiveCategory(category)}
              style={{ '--category-color': data.color }}
            >
              <div className="category-image-wrapper">
                <img src={data.image} alt={category} className="category-image" />
                <div className="category-overlay" />
              </div>
              
              <div className="category-content">
                <h3 className="category-title">{category}</h3>
                <p className="category-description">{data.description}</p>
                
                <div className="category-products">
                  <span className="products-label">Popular items:</span>
                  <ul className="products-list">
                    {data.products.map((product, index) => (
                      <li key={index}>{product}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="category-action">
                  <button className="explore-btn">
                    Explore Category
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {hoveredCategory === category && (
                <div className="category-hover-effect" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Quick Stats */}
      <div className="showcase-stats">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">1000+</span>
          <span className="stat-label">Happy Clients</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;