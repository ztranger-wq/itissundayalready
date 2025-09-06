import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeItemFromCart, updateItemQuantity, clearCart } = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]);

  // Normalize cart items
  const normalizeItem = (item) => {
    if (!item) return null;
    const product = item.product || item;
    const quantity = item.quantity ?? 1;
    return {
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price ?? 0,
      images: (product.images || (product.image ? [product.image] : [])),
      quantity,
      raw: item
    };
  };

  const normalizedCart = (cart || []).map(normalizeItem).filter(Boolean);

  useEffect(() => {
    // Initially, all items are selected
    setSelectedItems(normalizedCart.map(item => item._id));
  }, [cart, normalizedCart]);

  const handleSelectItem = (itemId) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const jakshItems = normalizedCart.filter(item => item.brand === 'Jaksh');
  const msItems = normalizedCart.filter(item => item.brand === 'MS');

  const subtotal = normalizedCart
    .filter(item => selectedItems.includes(item._id))
    .reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0), 0);

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page container page-padding">
      <h1 className="cart-page-title">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart-container">
          <p>Your cart is currently empty.</p>
          <Link to="/products" className="button-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-container">
            <div className="cart-header">
              <Link to="/products" className="continue-shopping-link">&larr; Continue shopping</Link>
              <button onClick={clearCart} className="button-danger">Clear Cart</button>
            </div>
            {jakshItems.length > 0 && (
              <div className="cart-brand-section">
                <h2 className="cart-brand-title">Jaksh Products</h2>
                {jakshItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <input
                      type="checkbox"
                      className="cart-item-checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                    <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                      <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                      <div className="cart-item-actions">
                        <div className="quantity-selector-cart">
                          <button onClick={() => updateItemQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeItemFromCart(item._id)} className="remove-item-btn"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="cart-item-subtotal">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            {msItems.length > 0 && (
              <div className="cart-brand-section">
                <h2 className="cart-brand-title">MS Enterprises Products</h2>
                {msItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <input
                      type="checkbox"
                      className="cart-item-checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                    <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                      <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                      <div className="cart-item-actions">
                        <div className="quantity-selector-cart">
                          <button onClick={() => updateItemQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeItemFromCart(item._id)} className="remove-item-btn"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="cart-item-subtotal">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="order-summary-container">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="button-primary w-full checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
