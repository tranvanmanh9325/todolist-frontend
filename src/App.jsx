import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ImageSlider from './components/login/background/ImageSlider';
import LoginForm from './components/login/signin/LoginForm';
import SignUpForm from './components/login/signout/SignUpForm';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// Giả định một component Dashboard
const Dashboard = () => {
  return <div>Welcome to the Dashboard!</div>;
};

function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route
          path="/login"
          element={
            <div className="login-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup' : 'login'}
                  initial={{ opacity: 0, x: isSignUp ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -100 : 100 }}
                  transition={{ duration: 0.35 }}
                  className="login-left-motion"
                >
                  {isSignUp ? (
                    <SignUpForm onSwitch={toggleForm} />
                  ) : (
                    <LoginForm onSwitch={toggleForm} />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="login-right">
                <ImageSlider />
              </div>
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            localStorage.getItem('token') ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;