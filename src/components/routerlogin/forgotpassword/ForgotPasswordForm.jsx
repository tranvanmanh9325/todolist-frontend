import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy email từ query parameter nếu có
  const initialEmail = searchParams.get('email') || '';
  if (initialEmail && step === 'email') {
    setEmail(initialEmail);
  }

  // Xử lý countdown cho nút Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { email }, { withCredentials: true });
      toast.success('Mã OTP đã được gửi đến email của bạn!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setStep('otp');
      setIsResendDisabled(true);
      setCountdown(60); // Bắt đầu countdown 60 giây
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
      console.error('Reset password error:', err);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation OTP: Kiểm tra OTP là 6 chữ số
    if (!/^\d{6}$/.test(otp)) {
      setError('Mã OTP phải là 6 chữ số');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otpCode: otp }, { withCredentials: true });
      toast.success('Mã OTP hợp lệ! Chuyển sang đặt lại mật khẩu.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.');
      console.error('Verify OTP error:', err);
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
        <p className="welcome-subtitle">
          {step === 'email' ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email'}
        </p>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="forgot-password-form">
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
            <button type="submit" className="reset-btn">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="otp" className="form-label">OTP Code</label>
              <input
                type="text"
                id="otp"
                className="form-input"
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-btn">Verify OTP</button>
            <button
              type="button"
              onClick={handleEmailSubmit}
              className="resend-btn"
              disabled={isResendDisabled}
              style={{ opacity: isResendDisabled ? 0.5 : 1, cursor: isResendDisabled ? 'not-allowed' : 'pointer' }}
            >
              {isResendDisabled ? `Gửi lại sau ${countdown}s` : 'Resend OTP'}
            </button>
          </form>
        )}

        <div className="back-to-login">
          <span>Back to </span>
          <Link to="/login" className="back-to-login-text">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;