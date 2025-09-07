import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductCard from '../components/products/ProductCard';
import Rating from '../components/products/Rating';

import UploadArtwork from '../components/products/CustomizationOptions/UploadArtwork';
import Style from '../components/products/CustomizationOptions/Style';
import Size from '../components/products/CustomizationOptions/Size';
import BackingOptions from '../components/products/CustomizationOptions/BackingOptions';
import SizeSymbolsOrColorVersions from '../components/products/CustomizationOptions/SizeSymbolsOrColorVersions';
import ProofOptions from '../components/products/CustomizationOptions/ProofOptions';
import TurnaroundOptions from '../components/products/CustomizationOptions/TurnaroundOptions';
import Comments from '../components/products/CustomizationOptions/Comments';

import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitReviewError, setSubmitReviewError] = useState('');
  const [submitReviewSuccess, setSubmitReviewSuccess] = useState('');

  // Customization option states
  const [artworkFile, setArtworkFile] = useState(null);
  const [style, setStyle] = useState('');
  const [size, setSize] = useState('');
  const [backingOption, setBackingOption] = useState('');
  const [sizeSymbolsOrColorVersion, setSizeSymbolsOrColorVersion] = useState('');
  const [proofOption, setProofOption] = useState('');
  const [turnaroundOption, setTurnaroundOption] = useState('');
  const [comments, setComments] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const { addItemToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Sample options - in real app, these might come from API or product data
  const styleOptions = ['Style A', 'Style B', 'Style C'];
  const sizeOptions = ['Small', 'Medium', 'Large'];
  const backingOptions = ['Option 1', 'Option 2', 'Option 3'];
  const sizeSymbolsOrColorVersionsOptions = ['Size Symbols', 'Color Versions'];
  const proofOptions = ['No Proof', 'Digital Proof', 'Physical Proof'];
  const turnaroundOptions = ['Standard', 'Rush', 'Express'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);
        setRelatedProducts([]);
        const { data: productData } = await axios.get(`${__API_BASE__}/api/products/${id}`);
        setProduct(productData);

        if (productData) {
          const params = new URLSearchParams();
          params.append('category', productData.category);
          params.append('brand', productData.brand);
          params.append('limit', 4);
          const { data: relatedData } = await axios.get(`${__API_BASE__}/api/products?${params.toString()}`);
          setRelatedProducts(relatedData.filter(p => p._id !== productData._id));
        }
      } catch (err) {
        setError('Could not load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    // Here you might want to include customization options in the cart item
    addItemToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setSubmitReviewError('');
    setSubmitReviewSuccess('');
    try {
      await api.post(`/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment }
      );
      setSubmitReviewSuccess('Review submitted successfully! It will appear after a refresh.');
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      setSubmitReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (loading) return <div className="container page-loader">Loading...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!product) return <div className="container">Product not found.</div>;

  return (
    <>
      <div className="product-detail-page container">
        <div className="product-detail-layout">
          <div className="product-gallery-container">
            <ProductImageGallery images={product.images} />
          </div>
          <div className="product-info-container">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="product-price">{product.price.toFixed(2)}</p>
            <p className="product-short-desc">{product.description}</p>

            <UploadArtwork artworkFile={artworkFile} setArtworkFile={setArtworkFile} />
            <Style style={style} setStyle={setStyle} styleOptions={styleOptions} />
            <Size size={size} setSize={setSize} sizeOptions={sizeOptions} />

            <div className="show-advanced-toggle">
              <input
                type="checkbox"
                id="showAdvancedOptions"
                checked={showAdvancedOptions}
                onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
              />
              <label htmlFor="showAdvancedOptions">Show Advanced Options</label>
            </div>

            {showAdvancedOptions && (
              <div className="advanced-options">
                <h3>Advanced Options</h3>
                <BackingOptions backingOption={backingOption} setBackingOption={setBackingOption} backingOptions={backingOptions} />
                <SizeSymbolsOrColorVersions option={sizeSymbolsOrColorVersion} setOption={setSizeSymbolsOrColorVersion} options={sizeSymbolsOrColorVersionsOptions} />
                <ProofOptions proofOption={proofOption} setProofOption={setProofOption} proofOptions={proofOptions} />
              </div>
            )}

            <TurnaroundOptions turnaroundOption={turnaroundOption} setTurnaroundOption={setTurnaroundOption} turnaroundOptions={turnaroundOptions} />
            <Comments comments={comments} setComments={setComments} />

            <div className="config-section">
              <label htmlFor="quantity" className="config-label">Quantity</label>
              {quantity > 10000 ? (
                <Link to="/quote" className="button-primary quote-button">
                  Request a Quote for 10000+ pcs
                </Link>
              ) : (
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              )}
            </div>

            <button
              className={`button-primary add-to-cart-btn-large ${isAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            <div className="product-accordion">
              <div className="accordion-item">
                <h3 className="accordion-title">Product Details</h3>
                <div className="accordion-content">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section container">
        <h2 className="section-title">Reviews</h2>
        {product.reviews.length === 0 && <p>No Reviews</p>}
        <div className="review-list">
          {product.reviews.map(review => (
            <div key={review._id} className="review-item">
              <strong>{review.name}</strong>
              <Rating value={review.rating} />
              <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="review-form-container">
          <h3 className="section-title">Write a Customer Review</h3>
          {user ? (
            <form onSubmit={submitReviewHandler}>
              {submitReviewError && <p className="error-message">{submitReviewError}</p>}
              {submitReviewSuccess && <p className="success-message">{submitReviewSuccess}</p>}
              <div className="form-group">
                <label>Rating</label>
                <select className="form-input" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} required>
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows="3" className="form-input" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="button-primary">Submit</button>
            </form>
          ) : (
            <p>Please <Link to="/login">log in</Link> to write a review.</p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <div className="container">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="product-list-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickView={() => {}} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
