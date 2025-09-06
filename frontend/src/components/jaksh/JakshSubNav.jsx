import { useState, useEffect } from 'react';
import './JakshSubNav.css';

const JakshSubNav = ({ categories, activeCategory, setActiveCategory }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`jaksh-sub-nav ${isSticky ? 'sticky' : ''}`}>
      <div className="container">
        <div className="sub-nav-content">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`sub-nav-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <span className="category-name">{category}</span>
                {activeCategory === category && (
                  <div className="active-indicator" />
                )}
              </button>
            ))}
          </div>
          
          <div className="nav-actions">
            <button className="quick-quote-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Quick Quote
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JakshSubNav;