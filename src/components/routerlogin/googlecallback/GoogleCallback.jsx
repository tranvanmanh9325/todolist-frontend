import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GoogleCallback.css'; // CSS riêng cho Google callback

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('❌ Google OAuth error:', error);
      alert('Google login was cancelled or failed.');
      navigate('/login');
      return;
    }

    if (!code) {
      console.error('❌ No authorization code returned from Google');
      alert('Google login failed. No code provided.');
      navigate('/login');
      return;
    }

    const exchangeCode = async () => {
      try {
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI; // ✅ đọc từ .env

        console.log('🔑 Sending code + redirectUri to backend:', {
          code,
          redirectUri,
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/google-login`,
          { code, redirectUri }
        );

        // ✅ Nhận thông tin từ backend
        const { id, name, email, token, avatar } = response.data;

        if (!token) {
          throw new Error('No JWT returned from backend');
        }

        // ✅ Lưu token + user info vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem(
          'user',
          JSON.stringify({ id, name, email, avatar })
        );

        console.log('✅ Google login success:', { id, name, email, avatar });

        // ✅ Sau khi login bằng Google thì vào Todo App
        navigate('/app/main', { replace: true });
      } catch (err) {
        console.error('❌ Google login error:', err.response?.data || err.message);
        alert('Google login failed on server side.');
        navigate('/login');
      }
    };

    exchangeCode();
  }, [navigate]);

  return (
    <div className="google-callback-container">
      <div className="spinner" />
      <p className="loading-text">Login with Google...</p>
    </div>
  );
};

export default GoogleCallback;