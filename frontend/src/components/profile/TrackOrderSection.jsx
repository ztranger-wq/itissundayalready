import { FaTruck } from 'react-icons/fa';
import './TrackOrderSection.css';

const TrackOrderSection = () => {
  return (
    <div className="track-order-content">
      <div className="section-header">
        <h3>Track Your Order</h3>
        <p>Monitor your order status</p>
      </div>
      <div className="track-order-placeholder">
        <FaTruck size={48} />
        <h4>Track Your Order</h4>
        <p>Enter your order ID to track your shipment</p>
        <div className="track-form">
          <input type="text" placeholder="Enter Order ID" className="form-input" />
          <button className="button-primary">Track Order</button>
        </div>
        <p className="note">Feature coming soon with full tracking integration</p>
      </div>
    </div>
  );
};

export default TrackOrderSection;
