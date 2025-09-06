import { useState } from 'react';
import AddressManager from './AddressManager';

const TrackOrder = () => {
  return (
    <div>
      <h2>Track Your Order</h2>
      <p>Feature coming soon...</p>
    </div>
  );
};

const FAQs = () => {
  return (
    <div>
      <h2>FAQs</h2>
      <p>Feature coming soon...</p>
    </div>
  );
};

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('address');

  return (
    <div className="profile-page container">
      <h1>Profile</h1>
      <div className="profile-nav">
        <button onClick={() => setActiveSection('address')} className={activeSection === 'address' ? 'active' : ''}>
          Addresses
        </button>
        <button onClick={() => setActiveSection('track')} className={activeSection === 'track' ? 'active' : ''}>
          Track Your Order
        </button>
        <button onClick={() => setActiveSection('faqs')} className={activeSection === 'faqs' ? 'active' : ''}>
          FAQs
        </button>
      </div>
      <div className="profile-content">
        {activeSection === 'address' && <AddressManager />}
        {activeSection === 'track' && <TrackOrder />}
        {activeSection === 'faqs' && <FAQs />}
      </div>
    </div>
  );
};

export default ProfilePage;
