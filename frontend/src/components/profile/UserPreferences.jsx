import React, { useState, useContext } from 'react';

// Mock context for standalone demonstration
const AuthContext = React.createContext({
  updateProfile: async (data) => {
    console.log("Updating profile with:", data);
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 500));
  }
});

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
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await updateProfile({ preferences: formData });
      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Failed to update preferences. Please try again.');
      console.error('Update preferences failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PreferenceItem = ({ id, title, description, checked, onChange }) => (
    <div className="preference-item">
      <div className="preference-text">
        <label htmlFor={id}>{title}</label>
        <p>{description}</p>
      </div>
      <div className="preference-control">
        <label className="toggle-switch">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
  
  const styles = `
    /* --- Global & Container --- */
    .user-preferences-container {
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      background-color: #f9fafb; /* Added a light background for context */
    }

    .preferences-card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      width: 100%;
      max-width: 700px;
      padding: 2rem;
    }

    /* --- Header --- */
    .section-header {
      text-align: left;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .section-header p {
      font-size: 0.95rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    /* --- Form & Sections --- */
    .preferences-form {
      width: 100%;
    }

    .preference-section {
      margin-bottom: 2.5rem;
    }

    .preference-section:last-of-type {
        margin-bottom: 0;
    }

    .preference-section h4 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
    }
    
    .preference-section h4 svg {
      color: #6b7280;
      width: 20px;
      height: 20px;
    }

    /* --- Preference Item --- */
    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .preference-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .preference-item:first-of-type {
      padding-top: 0;
    }

    .preference-text label {
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
      display: block;
      cursor: pointer;
    }

    .preference-text p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0.25rem 0 0;
      max-width: 400px;
    }

    /* --- Toggle Switch --- */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 28px;
      flex-shrink: 0;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #e50000;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #e50000;
    }

    input:checked + .slider:before {
      transform: translateX(22px);
    }


    /* --- Form Actions --- */
    .form-actions {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f3f4f6;
      display: flex;
      justify-content: flex-end;
    }

    .button-primary {
      background-color: #e50000;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }

    .button-primary:hover {
      background-color: #c00000;
      box-shadow: 0 4px 12px rgba(229, 0, 0, 0.2);
    }

    .button-primary:disabled {
      background-color: #fca5a5;
      cursor: not-allowed;
      box-shadow: none;
    }

    /* --- Messages --- */
    .message {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: 1px solid transparent;
    }

    .message.success {
      background-color: #f0fdf4;
      color: #15803d;
      border-color: #bbf7d0;
    }

    .message.error {
      background-color: #fef2f2;
      color: #b91c1c;
      border-color: #fecaca;
    }


    /* --- Responsive Design --- */
    @media (max-width: 640px) {
      .preferences-card {
        padding: 1.5rem;
      }
      
      .section-header h3 {
        font-size: 1.25rem;
      }

      .preference-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .preference-control {
        align-self: flex-end;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .button-primary {
        width: 100%;
        text-align: center;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="user-preferences-container">
        <div className="preferences-card">
          <div className="section-header">
            <h3>Preferences</h3>
            <p>Manage your notification settings and customize your experience.</p>
          </div>

          {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

          <form onSubmit={handleSubmit} className="preferences-form">
            <div className="preference-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Notifications
              </h4>
              <PreferenceItem
                id="emailNotifications"
                title="Email Notifications"
                description="Receive summaries of your order status and tracking."
                checked={formData.emailNotifications}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="smsNotifications"
                title="SMS Notifications"
                description="Get brief delivery updates on your mobile device."
                checked={formData.smsNotifications}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="orderUpdates"
                title="Order Updates"
                description="In-app notifications for order status changes."
                checked={formData.orderUpdates}
                onChange={handleInputChange}
              />
            </div>

            <div className="preference-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Marketing & Promotions
              </h4>
              <PreferenceItem
                id="newsletter"
                title="Weekly Newsletter"
                description="Stay in the loop with product highlights and news."
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="promotionalEmails"
                title="Promotional Emails"
                description="Receive special offers, discounts, and promotions."
                checked={formData.promotionalEmails}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="newProductAlerts"
                title="New Product Alerts"
                description="Be the first to know about new product launches."
                checked={formData.newProductAlerts}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="priceDropAlerts"
                title="Price Drop Alerts"
                description="Get notified when items in your wishlist go on sale."
                checked={formData.priceDropAlerts}
                onChange={handleInputChange}
              />
            </div>

            <div className="preference-section">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                App Experience
              </h4>
              <PreferenceItem
                id="darkMode"
                title="Dark Mode"
                description="A darker, eye-friendly theme. (Coming soon)"
                checked={formData.darkMode}
                onChange={handleInputChange}
              />
              <PreferenceItem
                id="autoSaveCart"
                title="Auto-Save Cart"
                description="Automatically save your shopping cart for your next visit."
                checked={formData.autoSaveCart}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="button-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserPreferences;

