import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaDownload, 
  FaTimes, 
  FaShippingFast, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import './OrderHistoryCard.css';

const OrderHistoryCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'Shipped': return <FaShippingFast className="status-icon shipped" />;
      case 'Processing': return <FaClock className="status-icon processing" />;
      case 'Cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status.toLowerCase().replace(' ', '-')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      console.log('Cancelling order:', order._id);
    }
  };

  return (
    <div className="order-history-card">
      <div className="order-header">
        <div className="order-info">
          <div className="order-number">
            <strong>#{order.orderNumber}</strong>
          </div>
          <div className="order-date">
            Ordered on {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="order-status">
          {getStatusIcon(order.orderStatus)}
          <span className={getStatusClass(order.orderStatus)}>
            {order.orderStatus}
          </span>
        </div>
        <div className="order-total">
          <strong>₹{order.totalPrice.toFixed(2)}</strong>
        </div>
      </div>

      <div className="order-items-preview">
        {order.orderItems.slice(0, 3).map((item, index) => (
          <div key={index} className="order-item-preview">
            <img 
              src={item.image || item.product?.images?.[0] || '/api/placeholder/60/60'} 
              alt={item.name}
              className="item-image"
            />
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
            </div>
          </div>
        ))}
        {order.orderItems.length > 3 && (
          <div className="more-items">
            +{order.orderItems.length - 3} more items
          </div>
        )}
      </div>

      <div className="order-actions">
        <button 
          className="action-btn view-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          <FaEye /> {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        
        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
          <button 
            className="action-btn cancel-order"
            onClick={handleCancelOrder}
          >
            <FaTimes /> Cancel Order
          </button>
        )}
        
        <Link 
          to={`/orders/${order._id}/invoice`} 
          className="action-btn download-invoice"
        >
          <FaDownload /> Invoice
        </Link>
        
        <Link 
          to={`/orders/${order._id}`}
          className="action-btn track-order"
        >
          Track Order
        </Link>
      </div>

      {showDetails && (
        <div className="order-details">
          <div className="details-header">
            <h4>Order Details</h4>
          </div>
          
          <div className="details-content">
            <div className="details-section">
              <h5>Items Ordered</h5>
              {order.orderItems.map((item, index) => (
                <div key={index} className="detail-item">
                  <img 
                    src={item.image || item.product?.images?.[0] || '/api/placeholder/40/40'} 
                    alt={item.name}
                    className="detail-item-image"
                  />
                  <div className="detail-item-info">
                    <span className="detail-item-name">{item.name}</span>
                    <span className="detail-item-brand">Brand: {item.brand}</span>
                    <span className="detail-item-price">₹{item.price} × {item.quantity}</span>
                  </div>
                  <div className="detail-item-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="details-section">
              <h5>Shipping Address</h5>
              <div className="shipping-address">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="details-section">
              <h5>Payment Information</h5>
              <div className="payment-info">
                <p>Method: {order.paymentMethod}</p>
                <p>Status: {order.isPaid ? 'Paid' : 'Pending'}</p>
                {order.paidAt && (
                  <p>Paid on: {formatDate(order.paidAt)}</p>
                )}
              </div>
            </div>

            <div className="details-section">
              <h5>Order Summary</h5>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Items Price:</span>
                  <span>₹{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{order.shippingPrice.toFixed(2)}</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>₹{order.taxPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span><strong>Total:</strong></span>
                  <span><strong>₹{order.totalPrice.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="details-section">
                <h5>Tracking Information</h5>
                <p>Tracking Number: <strong>{order.trackingNumber}</strong></p>
                {order.estimatedDelivery && (
                  <p>Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
