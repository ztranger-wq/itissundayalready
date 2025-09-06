import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import ProductCard from '../components/products/ProductCard';
import OrderHistoryCard from '../components/profile/OrderHistoryCard';
import AddressManager from '../components/profile/AddressManager';
import ProfileStats from '../components/profile/ProfileStats';
import UserPreferences from '../components/profile/UserPreferences';
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
      const response = await fetch('/api/auth/profile/change-password', {
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
      case 'overview': return (
        <div className="overview-content">
          <div className="profile-header">
            <div className="profile-info">
              <h2>{user.name}</h2><p className="email">{user.email}</p>
            </div>
          </div>
          <ProfileStats stats={orderStats} />
        </div>
      );
      case 'orders': return (
        <div className="orders-content">
          <div className="section-header"><h3>Order History</h3><p>View past orders</p></div>
          {orders.length === 0 ?
            <div className="empty-state"><FaShoppingBag size={48} /><h4>No Orders</h4><p>Start shopping!</p><button className="button-primary" onClick={() => navigate('/products')}>Shop Now</button></div>
            : <div className="orders-list">{orders.map(o => <OrderHistoryCard key={o._id} order={o} />)}</div>}
        </div>
      );
      case 'wishlist': return (
        <div className="wishlist-content">
          <div className="section-header"><h3>Wishlist</h3><p>Saved items</p></div>
          {user.wishlist?.length === 0 ?
            <div className="empty-state"><FaHeart size={48} /><h4>Empty</h4><p>Add items!</p><button className="button-primary" onClick={() => navigate('/products')}>Browse</button></div>
            : <div className="products-grid">{user.wishlist.map(p => <ProductCard key={p._id} product={p} />)}</div>}
        </div>
      );
      case 'addresses': return <AddressManager addresses={user.addresses} />;
      case 'track': return (
        <div className="track-order-content">
          <div className="section-header"><h3>Track Your Order</h3><p>Monitor your order status</p></div>
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
      case 'faqs': return (
        <div className="faqs-content">
          <div className="section-header"><h3>Frequently Asked Questions</h3><p>Find answers to common questions</p></div>
          <div className="faqs-list">
            <div className="faq-item">
              <h4>How do I track my order?</h4>
              <p>You can track your order using the tracking number provided in your order confirmation email.</p>
            </div>
            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We offer a 30-day return policy for most items. Please check the product page for specific return conditions.</p>
            </div>
            <div className="faq-item">
              <h4>How do I change my shipping address?</h4>
              <p>You can update your shipping address in the Addresses section of your profile.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, debit cards, UPI, net banking, and wallets through our secure PineLabs payment gateway.</p>
            </div>
            <div className="faq-item">
              <h4>How long does shipping take?</h4>
              <p>Standard shipping takes 5-7 business days. Express shipping is available for faster delivery.</p>
            </div>
          </div>
        </div>
      );
      case 'settings': return <UserPreferences preferences={user.preferences} />;
      case 'account': return (
        <div className="account-content">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-avatar-section">
              <div className="avatar-circle">
                <FaUser size={40} />
              </div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                <div className="member-since">
                  <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="profile-section personal-info">
            <div className="section-header-modern">
              <h3>👤 Personal Information</h3>
              <p>Update your personal details and contact information</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleUpdate} className="modern-form">
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="form-input disabled-input"
                  />
                  <span className="field-hint">Email cannot be changed</span>
                </div>

                <div className="form-field">
                  <label className="field-label">Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    required
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={e => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={e => setProfileData({ ...profileData, gender: e.target.value })}
                    className="form-input"
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions-modern">
                  <button type="submit" className="btn-primary-modern">
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-modern"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        name: user.name,
                        phone: user.phone,
                        dateOfBirth: user.dateOfBirth?.split('T')[0],
                        gender: user.gender
                      });
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Actions Section */}
          <div className="profile-section account-actions">
            <div className="section-header-modern">
              <h3>🔐 Account Actions</h3>
              <p>Manage your account security and preferences</p>
            </div>

            <div className="action-cards">
              <div className="action-card">
                <div className="action-icon">
                  <FaUser />
                </div>
                <div className="action-content">
                  <h4>Change Password</h4>
                  <p>Update your account password for better security</p>
              <button className="action-btn secondary" onClick={() => setShowChangePassword(true)}>Change Password</button>
                </div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <FaUser />
                </div>
                <div className="action-content">
                  <h4>Privacy Settings</h4>
                  <p>Control your data and privacy preferences</p>
                  <button className="action-btn secondary">Manage Privacy</button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="profile-section danger-zone-modern">
            <div className="section-header-modern">
              <h3>⚠️ Danger Zone</h3>
              <p>Irreversible actions that affect your account</p>
            </div>

            <div className="danger-actions-grid">
              <div className="danger-card">
                <div className="danger-icon">
                  🚪
                </div>
                <div className="danger-content">
                  <h4>Sign Out</h4>
                  <p>Sign out from your current session</p>
              <button className="danger-btn logout" onClick={() => setShowLogoutConfirm(true)}>
                Sign Out
              </button>
                </div>
              </div>

              <div className="danger-card">
                <div className="danger-icon">
                  🗑️
                </div>
                <div className="danger-content">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all data</p>
                  <button className="danger-btn delete" onClick={() => setShowDelete(true)}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {showDelete && (
              <div className="delete-confirmation-modal">
                <div className="modal-content">
                  <h4>🗑️ Confirm Account Deletion</h4>
                  <p>This action cannot be undone. All your data will be permanently removed.</p>
                  <div className="confirmation-input">
                    <label>Type "DELETE" to confirm:</label>
                    <input
                      type="text"
                      value={deleteText}
                      onChange={e => setDeleteText(e.target.value)}
                      className="form-input"
                      placeholder="DELETE"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-danger-confirm"
                      disabled={deleteText !== 'DELETE'}
                      onClick={handleDelete}
                    >
                      Yes, Delete Forever
                    </button>
                    <button
                      className="btn-secondary-modern"
                      onClick={() => { setShowDelete(false); setDeleteText(''); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
