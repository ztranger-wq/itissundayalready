import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import MovingBanner from '../components/jaksh/MovingBanner';
import JakshHero from '../components/jaksh/JakshHero';
import CategoryShowcase from '../components/jaksh/CategoryShowcase';
import './JakshPage.css';

const jakshCategories = [
  'All',
  'Badges & Recognition',
  'Corporate & Promotional Merchandise',
  'Event & Branding Solutions',
  'School & Institutional Solutions',
  'Packaging & Gifting'
];

const JakshPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Reset filters when category changes
  useEffect(() => {
    if (activeCategory !== 'All') {
      setSearchTerm('');
      setPriceRange({ min: '', max: '' });
    }
  }, [activeCategory]);

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
  };

  const clearAllFilters = () => {
    setActiveCategory('All');
    setSearchTerm('');
    setSortOrder('');
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = activeCategory !== 'All' || searchTerm || sortOrder || priceRange.min || priceRange.max;

  return (
    <div className="jaksh-page">
      <MovingBanner />
      <JakshHero />
      
      <div className="jaksh-main-content">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-separator">›</span>
            <span>Jaksh</span>
            {activeCategory !== 'All' && (
              <>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{activeCategory}</span>
              </>
            )}
          </nav>

          {/* Category Showcase */}
          <CategoryShowcase 
            categories={jakshCategories.slice(1)} // Exclude 'All'
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Filters and Controls */}
          <div className="products-section">
            <div className="products-header">
              <div className="products-title-section">
                <h2 className="products-title">
                  {activeCategory === 'All' ? 'All Jaksh Products' : activeCategory}
                </h2>
                <p className="products-subtitle">
                  Discover our premium collection of corporate and promotional solutions
                </p>
              </div>
              
              <div className="products-controls">
                <button 
                  className={`filters-toggle ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filters
                  {hasActiveFilters && <span className="filter-count-badge">!</span>}
                </button>

                <div className="view-controls">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                    </svg>
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                    </svg>
                  </button>
                </div>

                <div className="sort-controls">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    id="sort-select"
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select"
                  >
                    <option value="">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="advanced-filters-panel">
                <ProductFilters
                  categories={jakshCategories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onPriceFilter={handlePriceFilter}
                  priceRange={priceRange}
                />
                
                {hasActiveFilters && (
                  <div className="active-filters">
                    <span className="active-filters-label">Active filters:</span>
                    <div className="filter-tags">
                      {activeCategory !== 'All' && (
                        <span className="filter-tag">
                          {activeCategory}
                          <button onClick={() => setActiveCategory('All')}>×</button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="filter-tag">
                          Search: "{searchTerm}"
                          <button onClick={() => setSearchTerm('')}>×</button>
                        </span>
                      )}
                      {sortOrder && (
                        <span className="filter-tag">
                          Sort: {sortOrder.replace('-', ' ').replace('asc', 'Low to High').replace('desc', 'High to Low')}
                          <button onClick={() => setSortOrder('')}>×</button>
                        </span>
                      )}
                      {(priceRange.min || priceRange.max) && (
                        <span className="filter-tag">
                          Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                          <button onClick={() => setPriceRange({ min: '', max: '' })}>×</button>
                        </span>
                      )}
                    </div>
                    <button className="clear-all-filters" onClick={clearAllFilters}>
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className={`products-container ${viewMode}`}>
              <ProductList 
                brand="Jaksh" 
                category={activeCategory === 'All' ? '' : activeCategory} 
                searchTerm={searchTerm}
                sortOrder={sortOrder}
                viewMode={viewMode}
                priceRange={priceRange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JakshPage;