import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import './WishlistPage.css';

const WishlistPage = () => {
    const { wishlist } = useContext(AuthContext);

    const productsByBrand = wishlist.reduce((acc, product) => {
        if (product.brand === 'Jaksh') {
            acc.jaksh.push(product);
        } else if (product.brand === 'MS') {
            acc.ms.push(product);
        }
        return acc;
    }, { jaksh: [], ms: [] });

    return (
        <div className="container page-padding">
            <h1 className="wishlist-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <p className="empty-wishlist-message">Your wishlist is empty. Start liking products to see them here!</p>
            ) : (
                <>
                    {productsByBrand.jaksh.length > 0 && (
                        <section className="wishlist-section">
                            <h2 className="brand-title">Jaksh Products</h2>
                            <div className="product-list-grid">
                                {productsByBrand.jaksh.map(product => <ProductCard key={product._id} product={product} />)}
                            </div>
                        </section>
                    )}
                    {productsByBrand.ms.length > 0 && (
                        <section className="wishlist-section">
                            <h2 className="brand-title">MS Enterprises Products</h2>
                            <div className="product-list-grid">
                                {productsByBrand.ms.map(product => <ProductCard key={product._id} product={product} />)}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default WishlistPage;
