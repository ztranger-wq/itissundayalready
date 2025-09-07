import { useState, useContext } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './AddressManager.css';

const AddressManager = ({ addresses = [] }) => {
const { updateProfile } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) {
        throw new Error('No authentication token found');
      }
      const url = editingAddress
        ? `${__API_BASE__}/api/auth/profile/addresses/${editingAddress._id}`
        : `${__API_BASE__}/api/auth/profile/addresses`;

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const updatedUser = await response.json();
      updateProfile(updatedUser);
      setMessage(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
      resetForm();
    } catch (error) {
      console.error('Address operation failed:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`${__API_BASE__}/api/auth/profile/addresses/${addressId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete address');
        }

        const updatedUser = await response.json();
        updateProfile(updatedUser);
        setMessage('Address deleted successfully!');
      } catch (error) {
        console.error('Delete address failed:', error);
        setError('Failed to delete address. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${__API_BASE__}/api/auth/profile/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      const updatedUser = await response.json();
      updateProfile(updatedUser);
      setMessage('Default address updated successfully!');
    } catch (error) {
      console.error('Set default address failed:', error);
      setError('Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-manager">
      <div className="addresses-header">
        <div className="section-header">
          <h3>Saved Addresses</h3>
          <p>Manage your shipping addresses</p>
        </div>
        <button
          className="button-primary add-address-btn"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <FaPlus /> Add New Address
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {addresses.length === 0 ? (
        <div className="empty-addresses">
          <h4>No Saved Addresses</h4>
          <p>Add an address to make checkout faster</p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address._id} className="address-card">
              {address.isDefault && (
                <div className="default-badge">
                  <FaStar /> Default
                </div>
              )}
              
              <div className="address-content">
                <h4>{address.fullName}</h4>
                <p>{address.address}</p>
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="phone">Phone: {address.phone}</p>
              </div>

              <div className="address-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEdit(address)}
                >
                  <FaEdit />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(address._id)}
                >
                  <FaTrash />
                </button>
                {!address.isDefault && (
                  <button 
                    className="action-btn default"
                    onClick={() => handleSetDefault(address._id)}
                    title="Set as default"
                  >
                    <FaStar />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="address-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button 
                className="close-btn"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                    className="form-input"
                  >
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
              </div>

              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                  className="form-input"
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  />
                  Set as default address
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="button-primary">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
