import { useNavigate } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import { FaHeart } from 'react-icons/fa';
import './WishlistSection.css';

const WishlistSection = ({ wishlist }) => {
  const navigate = useNavigate();

  return (
    <div className="wishlist-content">
      <div className="section-header">
        <h3>Wishlist</h3>
        <p>Saved items</p>
      </div>
      {wishlist?.length === 0 ? (
        <div className="empty-state">
          <FaHeart size={48} />
          <h4>Empty</h4>
          <p>Add items!</p>
          <button className="button-primary" onClick={() => navigate('/products')}>
            Browse
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
