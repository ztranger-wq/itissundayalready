import { FaUser, FaEdit, FaShieldAlt, FaExclamationTriangle, FaSignOutAlt, FaTrashAlt, FaSave, FaTimes } from 'react-icons/fa';
import './AccountSection.css';

const AccountSection = ({
  user,
  isEditing,
  setIsEditing,
  profileData,
  setProfileData,
  handleUpdate,
  error,
  message,
  showDelete,
  setShowDelete,
  deleteText,
  setDeleteText,
  handleDelete,
  showChangePassword,
  setShowChangePassword,
  passwordData,
  setPasswordData,
  handleChangePassword,
  passwordMessage,
  passwordError,
  showLogoutConfirm,
  setShowLogoutConfirm,
  handleLogoutConfirm,
  showGooglePopup,
  setShowGooglePopup
}) => {
  return (
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
          <h3><FaUser /> Personal Information</h3>
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
                <FaSave /> Save Changes
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
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Actions Section */}
      <div className="profile-section account-actions">
        <div className="section-header-modern">
          <h3><FaShieldAlt /> Account Actions</h3>
          <p>Manage your account security and preferences</p>
        </div>

        <div className="action-cards">
          <div className="action-card" onClick={() => {
            if (user?.provider === 'google') {
              setShowGooglePopup(true);
            } else {
              setShowChangePassword(true);
            }
          }}>
            <div className="action-icon">
              <FaShieldAlt />
            </div>
            <div className="action-content">
              <h4>Change Password</h4>
              <p>Update your account password for better security</p>
              <button className="action-btn secondary">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="profile-section danger-zone-modern">
        <div className="section-header-modern">
          <h3><FaExclamationTriangle /> Danger Zone</h3>
          <p>Irreversible actions that affect your account</p>
        </div>

        <div className="danger-actions-grid">
          <div className="danger-card">
            <div className="danger-icon">
              <FaSignOutAlt />
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
              <FaTrashAlt />
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
              <h4><FaTrashAlt /> Confirm Account Deletion</h4>
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
};

export default AccountSection;
