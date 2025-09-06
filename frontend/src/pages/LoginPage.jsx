import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/api';
import './AuthForm.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);               // ✅ send { email, password }
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Failed to log in', err);
      setError(err?.message || err?.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  // ✅ On Google success, store token via loginWithGoogle (DO NOT call login())
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        await loginWithGoogle(response.data);     // ✅ store token & load profile
        navigate(from, { replace: true });
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
        <h2>Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="button-primary w-full">Login</button>
        </form>

        <p className="auth-alt">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>

        <div className="google-login-container">
          <button onClick={() => googleLogin()} className="button-google-login">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
