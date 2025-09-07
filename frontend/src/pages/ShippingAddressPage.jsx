import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import './ShippingAddressPage.css';

const ShippingAddressPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      setSelectedAddressId(user.addresses.find(addr => addr.isDefault)?.id || user.addresses[0]._id);
    }
  }, [user]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setNewAddress(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setNewAddress(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhone(newAddress.phone)) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${__API_BASE__}/api/auth/profile/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const updatedUser = await response.json();
      // Update user context with new address
      await updateProfile(updatedUser);
      setShowNewAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
      alert('Address saved successfully!');
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address or add a new one.');
      return;
    }
    const selectedAddress = user.addresses.find(addr => addr._id === selectedAddressId);
    const shippingInfo = {
      shippingAddress: selectedAddress,
      shippingMethod
    };
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    navigate('/checkout/payment');
  };

  return (
    <div className="container shipping-address-page">
      <h1>Checkout - Shipping Address</h1>

      {user && user.addresses && user.addresses.length > 0 ? (
        <div className="saved-addresses">
          <h2>Saved Addresses</h2>
          {user.addresses.map(addr => (
            <div
              key={addr._id}
              className={`saved-address ${selectedAddressId === addr._id ? 'selected' : ''}`}
              onClick={() => handleSelectAddress(addr._id)}
            >
              <p>{addr.fullName}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.postalCode}</p>
              <p>{addr.country}</p>
              <p>{addr.phone}</p>
            </div>
          ))}
          <button className="button-primary add-address-btn" onClick={() => setShowNewAddressForm(true)}>
            <FaPlus /> Add New Address
          </button>
        </div>
      ) : (
        <div>
          <p>No saved addresses found. Please add a new address.</p>
          <button className="button-primary add-address-btn" onClick={() => setShowNewAddressForm(true)}>
            <FaPlus /> Add New Address
          </button>
        </div>
      )}

      {showNewAddressForm && (
        <form className="shipping-form" onSubmit={handleAddNewAddress}>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="fullName" value={newAddress.fullName} onChange={handleNewAddressChange} required />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={newAddress.phone}
              onChange={handleNewAddressChange}
              required
              placeholder="10-digit mobile number"
              maxLength="10"
            />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <textarea name="address" value={newAddress.address} onChange={handleNewAddressChange} required />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={newAddress.city} onChange={handleNewAddressChange} required />
          </div>
          <div className="form-group">
            <label>State *</label>
            <select name="state" value={newAddress.state} onChange={handleNewAddressChange} required>
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
              <option value="Lakshadweep">Lakshadweep</option>
            </select>
          </div>
          <div className="form-group">
            <label>Postal Code *</label>
            <input type="text" name="postalCode" value={newAddress.postalCode} onChange={handleNewAddressChange} required />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input type="text" value="India" readOnly className="form-input" />
          </div>
          <div className="form-group checkbox-group">
            <input type="checkbox" name="isDefault" checked={newAddress.isDefault} onChange={handleNewAddressChange} />
            <label>Set as default address</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button-primary">Save Address</button>
            <button type="button" className="button-secondary" onClick={() => setShowNewAddressForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="form-group shipping-method">
        <label>Shipping Method</label>
        <div>
          <label>
            <input type="radio" name="shippingMethod" value="standard" checked={shippingMethod === 'standard'} onChange={handleShippingMethodChange} />
            Standard (Free or low cost)
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="shippingMethod" value="express" checked={shippingMethod === 'express'} onChange={handleShippingMethodChange} />
            Express / Same-Day (if available)
          </label>
        </div>
      </div>

      <button className="button-primary continue-payment-btn" onClick={handleContinue}>Continue to Payment</button>
    </div>
  );
};

export default ShippingAddressPage;
