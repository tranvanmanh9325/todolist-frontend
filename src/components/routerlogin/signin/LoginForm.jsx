import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // ✅ Lấy đầy đủ thông tin từ backend
      const { id, name, email: userEmail, token, avatar } = response.data;

      // ✅ Lưu token + user info vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({ id, name, email: userEmail, avatar })
      );

      // ✅ Chuyển vào Todo App
      navigate('/app/main', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI; // ✅ lấy từ .env
    const scope = encodeURIComponent('email profile openid');
    const responseType = 'code';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <motion.div
      className="login-left"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="#f80000d5"
                strokeWidth="2"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="#f80000d5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">To-do List</span>
        </div>
      </div>

      {/* Form */}
      <div className="login-form-section">
        <h1 className="welcome-title">Welcome Back!</h1>
        <p className="welcome-subtitle">Please enter login details below</p>

        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter the Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="sign-in-btn">
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or continue</span>
        </div>

        {/* Google login */}
        <button onClick={handleGoogleLogin} className="google-oauth-button">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{
              width: 21,
              height: 21,
              marginRight: 10,
              marginTop: -2,
              verticalAlign: 'middle',
              display: 'inline-block',
            }}
          />
          Login with Google
        </button>

        {/* Link to Register */}
        <div className="signup-link">
          <span>Don't have an account? </span>
          <Link to="/register" className="signup-text">
            Sign Up
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;