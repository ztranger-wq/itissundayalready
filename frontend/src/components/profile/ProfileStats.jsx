import { FaShoppingBag, FaRupeeSign, FaTruck, FaHeart } from 'react-icons/fa';
import './ProfileStats.css';

const ProfileStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      icon: FaShoppingBag,
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      color: 'blue'
    },
    {
      icon: FaRupeeSign,
      title: 'Total Spent',
      value: `₹${(stats.totalSpent || 0).toFixed(2)}`,
      color: 'green'
    },
    {
      icon: FaTruck,
      title: 'Delivered Orders',
      value: stats.statusBreakdown?.find(s => s._id === 'Delivered')?.count || 0,
      color: 'purple'
    },
    {
      icon: FaHeart,
      title: 'Wishlist Items',
      value: stats.wishlistCount || 0,
      color: 'red'
    }
  ];

  return (
    <div className="profile-stats">
      <h3>Your Statistics</h3>
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <IconComponent />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="recent-orders">
          <h4>Recent Orders</h4>
          <div className="recent-orders-list">
            {stats.recentOrders.map(order => (
              <div key={order._id} className="recent-order-item">
                <div className="recent-order-info">
                  <span className="order-number">#{order.orderNumber}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="recent-order-status">
                  <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="recent-order-total">
                  ₹{order.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
