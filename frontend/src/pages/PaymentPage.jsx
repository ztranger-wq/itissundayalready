import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get shipping info from localStorage
    const shipping = localStorage.getItem('shippingInfo');
    if (!shipping) {
      navigate('/checkout');
      return;
    }
    setShippingInfo(JSON.parse(shipping));
  }, [navigate]);

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

  const subtotal = normalizedCart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0), 0);
  const shipping = subtotal > 0 ? (shippingInfo?.shippingMethod === 'express' ? 100 : 50) : 0;
  const tax = (subtotal + shipping) * 0.18; // 18% GST
  const total = subtotal + shipping + tax - discount;

  const handleCouponApply = () => {
    // TODO: Implement coupon validation
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    if (!shippingInfo) return;

    setIsProcessing(true);

    try {
      // Create order first
      const orderData = {
        orderItems: normalizedCart.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address1: shippingInfo.address1,
          address2: shippingInfo.address2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        shippingMethod: shippingInfo.shippingMethod,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        orderNotes: ''
      };

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Initialize PineLabs payment
      await initiatePineLabsPayment(order._id, total);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const initiatePineLabsPayment = async (orderId, amount) => {
    // TODO: Implement PineLabs SDK integration
    // For now, simulate payment
    console.log('Initiating PineLabs payment for order:', orderId, 'amount:', amount);

    // Simulate PineLabs redirect
    setTimeout(() => {
      // Simulate success
      navigate('/checkout/success');
    }, 3000);
  };

  if (!shippingInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container payment-page">
      <h1>Checkout - Payment</h1>

      <div className="payment-layout">
        <div className="payment-form-section">
          <div className="payment-methods">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Net Banking</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Wallets</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="coupon-section">
            <h3>Coupon Code</h3>
            <div className="coupon-input">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleCouponApply} className="button-secondary">Apply</button>
            </div>
          </div>
        </div>

        <div className="order-summary-sidebar">
          <h2>Order Summary</h2>
          <div className="order-items">
            {normalizedCart.map(item => (
              <div key={item._id} className="order-item">
                <img src={item.images[0]} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="total-row discount">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row final-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="button-primary pay-now-btn"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
