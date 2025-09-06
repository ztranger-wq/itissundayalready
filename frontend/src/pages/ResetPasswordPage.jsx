import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useContext(AuthContext);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setError('');
    setMessage('');
    try {
      const data = await resetPassword(token, password);
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password" id="confirmPassword" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required className="form-input"
            />
          </div>
          <button type="submit" className="button-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;