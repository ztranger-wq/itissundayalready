import { FaShoppingBag, FaRupeeSign, FaTruck, FaHeart } from 'react-icons/fa';
import './ProfileStats.css';

const ProfileStats = ({ stats, onStatClick, wishlistCount }) => {
  if (!stats) return null;

  const statCards = [
    {
      icon: FaShoppingBag,
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      color: 'blue',
      clickable: true,
      tabId: 'orders'
    },
    {
      icon: FaRupeeSign,
      title: 'Total Spent',
      value: `₹${(stats.totalSpent || 0).toLocaleString('en-IN')}`,
      color: 'green',
      clickable: false
    },
    {
      icon: FaTruck,
      title: 'Delivered Orders',
      value: stats.statusBreakdown?.find(s => s._id === 'Delivered')?.count || 0,
      color: 'purple',
      clickable: false
    },
    {
      icon: FaHeart,
      title: 'Wishlist Items',
      value: wishlistCount !== undefined ? wishlistCount : (stats.wishlistCount || 0),
      color: 'red',
      clickable: true,
      tabId: 'wishlist'
    }
  ];

  return (
    <div className="stats-dashboard">
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Your Statistics</h3>
        <div className="stats-grid">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            const handleClick = () => {
              if (stat.clickable && onStatClick) {
                onStatClick(stat.tabId);
              }
            };
            return (
              <div
                key={index}
                className={`stat-card${stat.clickable ? ' clickable' : ''}`}
                onClick={handleClick}
                role={stat.clickable ? 'button' : undefined}
                tabIndex={stat.clickable ? 0 : undefined}
                onKeyPress={e => {
                  if (stat.clickable && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick();
                  }
                }}
              >
                <div className={`stat-icon-wrapper ${stat.color}`}>
                  <IconComponent className="stat-icon" />
                </div>
                <div className="stat-content">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Recent Orders</h3>
          <div className="orders-container">
            <div className="orders-header">
              <div className="header-item">Order ID</div>
              <div className="header-item">Date</div>
              <div className="header-item">Status</div>
              <div className="header-item">Total</div>
            </div>
            <div className="orders-list">
              {stats.recentOrders.map(order => (
                <div key={order._id} className="order-row">
                  <div className="order-cell" data-label="Order ID">
                    <span className="order-number">#{order.orderNumber}</span>
                  </div>
                  <div className="order-cell" data-label="Date">
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="order-cell" data-label="Status">
                    <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="order-cell order-total" data-label="Total">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
