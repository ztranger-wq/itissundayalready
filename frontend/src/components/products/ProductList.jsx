import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductList.css';
import { useDebounce } from '../../hooks/useDebounce';

const API_URL = '/api/products';

const ProductList = ({ brand, category, searchTerm, limit, sortOrder, viewMode = 'grid', priceRange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (brand) params.append('brand', brand);
        if (category) params.append('category', category);
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (limit) params.append('limit', limit);
        if (sortOrder) params.append('sort', sortOrder);
        if (priceRange?.min) params.append('minPrice', priceRange.min);
        if (priceRange?.max) params.append('maxPrice', priceRange.max);

        const { data } = await axios.get(`${API_URL}?${params.toString()}`);
        // Ensure data is always an array
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]); // Set empty array on error
        if (err.code === "ERR_NETWORK") {
          setError("Network Error: Could not connect to the server. Please ensure the backend is running.");
        } else {
          setError("An error occurred while loading products.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [brand, category, debouncedSearchTerm, limit, sortOrder, priceRange]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="error-title">Oops! Something went wrong</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Ensure products is always an array before checking length
  const productsArray = Array.isArray(products) ? products : [];

  if (productsArray.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="empty-title">No products found</h3>
        <p className="empty-message">
          {searchTerm || category 
            ? "Try adjusting your search or filter criteria to find what you're looking for."
            : "We're working on adding new products. Check back soon!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {!limit && (
        <div className="product-list-header">
          <p className="products-count">
            Showing {productsArray.length} product{productsArray.length !== 1 ? 's' : ''}
            {category && category !== 'All' && ` in ${category}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      )}
      
      <div className={`product-list-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {productsArray.map((product, index) => (
          <ProductCard 
            key={product._id || index} 
            product={product}
            index={index}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;