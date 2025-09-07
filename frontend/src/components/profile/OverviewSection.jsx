import ProfileStats from './ProfileStats';
import './OverviewSection.css';

const OverviewSection = ({ user, orderStats, setActiveTab }) => {
  return (
    <div className="overview-content">
      <div className="profile-header">
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>
        </div>
      </div>
      <ProfileStats
        stats={orderStats}
        onStatClick={setActiveTab}
        wishlistCount={user.wishlist?.length || 0}
      />
    </div>
  );
};

export default OverviewSection;
