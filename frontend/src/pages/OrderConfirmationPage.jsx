import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading order details...</div>;
  }

  return (
    <div className="container order-confirmation-page">
      <div className="confirmation-content">
        <div className="success-icon">✅</div>
        <h1>Thank you for your order!</h1>

        {order && (
          <div className="order-details">
            <div className="order-info">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Transaction ID:</strong> {order.paymentResult?.transactionId || 'N/A'}</p>
              <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
              <p><strong>Delivery Date:</strong> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
            </div>

            <div className="shipping-info">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address1}</p>
              {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>

            <div className="order-items">
              <h3>Items Ordered</h3>
              {order.orderItems?.map(item => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-brand">{item.brand}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <p><strong>Total: ₹{order.totalPrice?.toFixed(2)}</strong></p>
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/products" className="button-primary">Continue Shopping</Link>
          <button className="button-secondary">Track Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
