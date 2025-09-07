import { useNavigate } from 'react-router-dom';
import OrderHistoryCard from './OrderHistoryCard';
import { FaShoppingBag } from 'react-icons/fa';
import './OrdersSection.css';

const OrdersSection = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <div className="orders-content">
      <div className="section-header">
        <h3>Order History</h3>
        <p>View past orders</p>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">
          <FaShoppingBag size={48} />
          <h4>No Orders</h4>
          <p>Start shopping!</p>
          <button className="button-primary" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <OrderHistoryCard key={o._id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
