import React, { useState } from 'react';
import './App.css';
import ImageSlider from './components/login/background/ImageSlider';
import LoginForm from './components/login/signin/LoginForm';
import SignUpForm from './components/login/signout/SignUpForm';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
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
  );
}

export default App;