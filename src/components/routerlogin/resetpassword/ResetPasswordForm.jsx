import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const email = query.get('email') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:8080/api/auth/change-password', {
        email,
        password,
        confirm,
      }, { withCredentials: true }); // Thêm withCredentials
      toast.success('Mật khẩu đã được thay đổi thành công!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
      console.error('Change password error:', err);
    }
  };

  return (
    <div className="reset-password-container">
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

      <div className="reset-password-form-section">
        <h1 className="welcome-title">Reset Password</h1>
        <p className="welcome-subtitle">Enter your new password</p>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              className="form-input"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-btn">Change Password</button>
        </form>

        <div className="back-to-login">
          <span>Back to </span>
          <Link to="/login" className="back-to-login-text">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;