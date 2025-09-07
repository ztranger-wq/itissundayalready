import { useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, index = 0, viewMode = 'grid' }) => {
  const { addItemToCart } = useContext(CartContext);
  const { user, wishlist = [], toggleWishlist } = useContext(AuthContext);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const navigate = useNavigate();

  // Ensure wishlist is always an array
  const wishlistArray = Array.isArray(wishlist) ? wishlist : [];
  const isLiked = wishlistArray.some(p => p._id === product._id);

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    } else {
      console.error('Product ID is missing');
    }
  };

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    if (isLoading) return; // Debounce
    if (!product) {
      console.error('Product is missing');
      return;
    }

    setIsLoading(true);
    try {
      await addItemToCart(product);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 500); // Debounce delay
    }
  }, [isLoading, product, addItemToCart]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (isLikeLoading) return; // Debounce
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      navigate('/login');
      return;
    }

    setIsLikeLoading(true);
    try {
      await toggleWishlist(product._id);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setTimeout(() => setIsLikeLoading(false), 500); // Debounce delay
    }
  }, [isLikeLoading, user, navigate, toggleWishlist, product._id]);

  const getCategoryBadge = (category) => {
    if (!category) return null;
    
    const categoryClass = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return (
      <div className={`product-badge ${categoryClass}`}>
        {category}
      </div>
    );
  };

  const formatPrice = (price) => {
    // Remove any existing currency symbols
    const cleanPrice = String(price).replace(/[₹$€£¥₽₩₦₨₪₫₡₵₺₴₸₼₲₱₭₯₰₳₶₷₹₻₽₾₿]/g, '').trim();
    const numPrice = parseFloat(cleanPrice);
    if (isNaN(numPrice)) return '₹0';
    return `${numPrice.toLocaleString('en-IN')}`;
  };

  // Ensure product has required properties
  if (!product) {
    return null;
  }

  const productImages = Array.isArray(product.images) ? product.images : [];
  const productImage = productImages.length > 0 ? productImages[0] : `${__API_BASE__}/api/placeholder/300/400`;

  return (
    <div 
      className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="product-image-container">
        <img 
          src={productImage} 
          alt={product.name || 'Product'} 
          className="product-image" 
        />
        
        {product.category && getCategoryBadge(product.category)}
        
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''} ${isLikeLoading ? 'loading' : ''}`}
          disabled={isLikeLoading}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>

        <button 
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          Quick View
        </button>
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name || 'Unnamed Product'}</h3>
        <p className="product-description">{product.description || 'No description available'}</p>
        
        <div className="product-footer">
          <div className="product-price">
            {formatPrice(product.price || 0)}
          </div>
          <button
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${isAdded ? 'added' : ''} ${isLoading ? 'loading' : ''}`}
            disabled={isAdded || isLoading}
            aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
          >
            {isLoading ? '' : isAdded ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;