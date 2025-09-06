import { useState } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ 
  categories = [], 
  activeCategory, 
  setActiveCategory, 
  searchTerm, 
  setSearchTerm,
  onPriceFilter,
  priceRange = { min: '', max: '' }
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchTerm('');
    setLocalPriceRange({ min: '', max: '' });
    if (onPriceFilter) {
      onPriceFilter('', '');
    }
  };

  const handlePriceChange = (field, value) => {
    const newRange = { ...localPriceRange, [field]: value };
    setLocalPriceRange(newRange);
    if (onPriceFilter) {
      onPriceFilter(newRange.min, newRange.max);
    }
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3 className="filters-title">Find Your Perfect Product</h3>
        {(searchTerm || activeCategory !== 'All' || localPriceRange.min || localPriceRange.max) && (
          <button 
            className="filters-reset"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search for products, categories, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="search-clear"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="filter-buttons-container">
        <h4 className="filter-section-title">Categories</h4>
        <div className="filter-buttons">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category === 'All' && <span className="filter-count">All</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button 
        className="advanced-filters-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="price-input"
                  min="0"
                />
                <span className="price-separator">to</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="price-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="availability-select">Availability</label>
            <select id="availability-select" className="filter-select">
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="rating-filter">Minimum Rating</label>
            <select id="rating-filter" className="filter-select">
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;