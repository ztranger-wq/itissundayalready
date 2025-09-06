import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/api';
import './AuthForm.css';

const RegisterPage = () => {
  const { register, loginWithGoogle } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);         // ✅ regular register path
      navigate('/');
    } catch (err) {
      console.error('Failed to register', err);
      setError(err?.message || err?.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // ✅ On Google, just treat it as login-with-google (you’re already "registered")
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        await loginWithGoogle(response.data);        // ✅ not register(response.data)
        navigate('/');
      } catch (err) {
        console.error('Google login failed:', err);
        setError('Google login failed. Please try again.');
      }
    },
    onError: () => {
      console.error('Google login error');
      setError('Google login failed. Please try again.');
    },
    flow: 'implicit',
  });

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Register</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="button-primary w-full">Create account</button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <div className="google-login-container">
          <button onClick={() => googleLogin()} className="button-google-login">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
