import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import ProductCard from '../components/products/ProductCard';
import OrderHistoryCard from '../components/profile/OrderHistoryCard';
import AddressManager from '../components/profile/AddressManager';
import ProfileStats from '../components/profile/ProfileStats';
import UserPreferences from '../components/profile/UserPreferences';
import OverviewSection from '../components/profile/OverviewSection';
import OrdersSection from '../components/profile/OrdersSection';
import WishlistSection from '../components/profile/WishlistSection';
import TrackOrderSection from '../components/profile/TrackOrderSection';
import FAQsSection from '../components/profile/FAQsSection';
import AccountSection from '../components/profile/AccountSection';
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaCog, FaChartLine, FaEdit, FaTruck, FaQuestionCircle } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, updateProfile, deleteAccount, loading } = useContext(AuthContext);
  const { orders, getMyOrders, orderStats, getOrderStats } = useContext(OrderContext);
  const navigate = useNavigate();
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'orders', label: 'Order History', icon: FaShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
    { id: 'track', label: 'Track Your Order', icon: FaTruck },
    { id: 'faqs', label: 'FAQs', icon: FaQuestionCircle },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'account', label: 'Account', icon: FaUser }
  ];
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', dateOfBirth: '', gender: '' });
  const [message, setMessage] = useState(''), [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false), [deleteText, setDeleteText] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState(''), [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || ''
      });
      getMyOrders();
      getOrderStats();
    }
  }, [user, getMyOrders, getOrderStats]);

  if (loading) return <div className="profile-loading"><div className="loading-spinner" /><h2>Loading Profile...</h2></div>;
  if (!user) return <div className="profile-error"><h2>Access Denied</h2><p>Please log in.</p></div>;

  const handleUpdate = async e => {
    e.preventDefault(); setError(''); setMessage('');
    try { await updateProfile(profileData); setMessage('Profile updated!'); setIsEditing(false); }
    catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await deleteAccount(); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); setShowDelete(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); setPasswordError(''); setPasswordMessage('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const response = await fetch(`${__API_BASE__}/api/auth/profile/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowChangePassword(false);
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection user={user} orderStats={orderStats} setActiveTab={setActiveTab} />;
      case 'orders': return <OrdersSection orders={orders} />;
      case 'wishlist': return <WishlistSection wishlist={user.wishlist} />;
      case 'addresses': return <AddressManager addresses={user.addresses} />;
      case 'track': return <TrackOrderSection />;
      case 'faqs': return <FAQsSection />;
      case 'settings': return <UserPreferences preferences={user.preferences} />;
      case 'account': return (
        <AccountSection
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          profileData={profileData}
          setProfileData={setProfileData}
          handleUpdate={handleUpdate}
          error={error}
          message={message}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          deleteText={deleteText}
          setDeleteText={setDeleteText}
          handleDelete={handleDelete}
          showChangePassword={showChangePassword}
          setShowChangePassword={setShowChangePassword}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handleChangePassword={handleChangePassword}
          passwordMessage={passwordMessage}
          passwordError={passwordError}
          showLogoutConfirm={showLogoutConfirm}
          setShowLogoutConfirm={setShowLogoutConfirm}
          handleLogoutConfirm={handleLogoutConfirm}
          showGooglePopup={showGooglePopup}
          setShowGooglePopup={setShowGooglePopup}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="profile-page container">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <nav className="profile-nav">
            {tabs.map(tab => (
              <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <tab.icon /><span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="profile-main">
          {renderTab()}

          {/* Change Password Modal */}
          {showChangePassword && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Change Password</h3>
                {passwordError && <div className="error-message">{passwordError}</div>}
                {passwordMessage && <div className="success-message">{passwordMessage}</div>}
                <form onSubmit={handleChangePassword} className="change-password-form">
                  <div className="form-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      minLength="8"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="btn-primary-modern">Change Password</button>
                    <button type="button" className="btn-secondary-modern" onClick={() => setShowChangePassword(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to sign out?</p>
                <div className="modal-actions">
                  <button className="btn-primary-modern" onClick={handleLogoutConfirm}>Confirm</button>
                  <button className="btn-secondary-modern" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Google Login Popup */}
          {showGooglePopup && (
            <div className="modal-overlay">
              <div className="modal-content google-popup">
                <div className="google-popup-content">
                  <div className="google-icon">🔒</div>
                  <h3>Login with Google doesn't support password change</h3>
                  <p>Since you logged in with your Google account, you cannot change your password through this application.</p>
                  <div className="modal-actions">
                    <button className="btn-primary-modern" onClick={() => setShowGooglePopup(false)}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
