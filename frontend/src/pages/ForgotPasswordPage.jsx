import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Forgot Password</h2>
        <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required className="form-input"
            />
          </div>
          <button type="submit" className="button-primary w-full">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;