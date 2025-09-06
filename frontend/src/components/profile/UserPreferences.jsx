import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './UserPreferences.css';

const UserPreferences = ({ preferences = {} }) => {
  const { updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    newsletter: preferences.newsletter ?? true,
    smsNotifications: preferences.smsNotifications ?? true,
    emailNotifications: preferences.emailNotifications ?? true,
    orderUpdates: preferences.orderUpdates ?? true,
    promotionalEmails: preferences.promotionalEmails ?? false,
    newProductAlerts: preferences.newProductAlerts ?? true,
    priceDropAlerts: preferences.priceDropAlerts ?? true,
    darkMode: preferences.darkMode ?? false,
    autoSaveCart: preferences.autoSaveCart ?? true
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ preferences: formData });
      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update preferences failed:', error);
    }
  };

  return (
    <div className="user-preferences">
      <div className="section-header">
        <h3>Preferences</h3>
        <p>Customize your shopping experience</p>
      </div>
      
      {message && <div className="success-message">{message}</div>}
      
      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="preference-section">
          <h4>🔔 Notifications</h4>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({
                  ...formData,
                  emailNotifications: e.target.checked
                })}
              />
              <span>Email notifications for orders and updates</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.smsNotifications}
                onChange={(e) => setFormData({
                  ...formData,
                  smsNotifications: e.target.checked
                })}
              />
              <span>SMS notifications for delivery updates</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.orderUpdates}
                onChange={(e) => setFormData({
                  ...formData,
                  orderUpdates: e.target.checked
                })}
              />
              <span>Order status updates and tracking notifications</span>
            </label>
          </div>
        </div>

        <div className="preference-section">
          <h4>📧 Marketing & Promotions</h4>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({
                  ...formData,
                  newsletter: e.target.checked
                })}
              />
              <span>Weekly newsletter with product highlights</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.promotionalEmails}
                onChange={(e) => setFormData({
                  ...formData,
                  promotionalEmails: e.target.checked
                })}
              />
              <span>Promotional emails and special offers</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.newProductAlerts}
                onChange={(e) => setFormData({
                  ...formData,
                  newProductAlerts: e.target.checked
                })}
              />
              <span>New product launch notifications</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.priceDropAlerts}
                onChange={(e) => setFormData({
                  ...formData,
                  priceDropAlerts: e.target.checked
                })}
              />
              <span>Price drop alerts for wishlist items</span>
            </label>
          </div>
        </div>

        <div className="preference-section">
          <h4>⚙️ App Preferences</h4>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.darkMode}
                onChange={(e) => setFormData({
                  ...formData,
                  darkMode: e.target.checked
                })}
              />
              <span>Enable dark mode (coming soon)</span>
            </label>
          </div>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.autoSaveCart}
                onChange={(e) => setFormData({
                  ...formData,
                  autoSaveCart: e.target.checked
                })}
              />
              <span>Auto-save cart for later</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="button-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferences;
