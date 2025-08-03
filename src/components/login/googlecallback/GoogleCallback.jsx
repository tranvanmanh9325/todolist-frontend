import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      alert('Google login was cancelled or failed.');
      navigate('/login');
      return;
    }

    if (!code) {
      console.error('No authorization code returned from Google');
      alert('Google login failed. No code provided.');
      navigate('/login');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/google-login`, // Ensure backend is mapped correctly
          { code },
          { withCredentials: true }
        );

        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } catch (err) {
        console.error('Google login error:', err);
        alert('Google login failed on server side.');
        navigate('/login');
      }
    };

    exchangeCode();
  }, [navigate]);

  return <p>Logging in with Google...</p>;
};

export default GoogleCallback;