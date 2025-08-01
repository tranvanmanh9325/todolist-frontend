import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { email });

      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email.', {
        position: 'top-center',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
      console.error('Reset password error:', err);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#f80000d5" strokeWidth="2" />
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

      <div className="forgot-password-form-section">
        <h1 className="welcome-title">Forgot Password?</h1>
        <p className="welcome-subtitle">Enter your email to reset your password</p>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">Send Reset Link</button>
        </form>

        <div className="back-to-login">
          <span>Back to </span>
          <Link to="/login" className="back-to-login-text">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;