import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const products = [
    { name: 'Garment Labels', img: '/ms-images/ms-image-1.png' },
    { name: 'Hang Tags', img: '/ms-images/ms-image-2.png' },
    { name: 'Lanyards & Ribbons', img: '/ms-images/ms-image-3.png' },
    { name: 'Custom Gifts', img: '/ms-images/ms-image-4.png' },
    { name: 'Office Essentials', img: '/ms-images/ms-image-5.png' },
    { name: 'Wearables', img: '/ms-images/ms-image-6.png' },
  ];

  return (
    <section id="products" className="featured-products-section">
      <div className="container">
        <h2>Our Products</h2>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-item">
              <img src={product.img} alt={product.name} className="product-image" />
              <div className="product-overlay">
                <span className="product-text">{product.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="button-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
