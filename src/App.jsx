import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/sidebars/Sidebar';
import MainContent from './components/routermain/MainContent';
import Completed from './components/routermain/Completed';
import TaskOverlay from './components/tasks/TaskOverlay';
import TaskReport from './components/tasks/TaskReport';
import Help from './components/routerhelp/Help';
import { TaskFormProvider } from './contexts/TaskFormContext';

import ImageSlider from './components/routerlogin/background/ImageSlider';
import LoginForm from './components/routerlogin/signin/LoginForm';
import SignUpForm from './components/routerlogin/signout/SignUpForm';
import ForgotPasswordForm from './components/routerlogin/forgotpassword/ForgotPasswordForm';
import ResetPasswordForm from './components/routerlogin/resetpassword/ResetPasswordForm';
import GoogleCallback from './components/routerlogin/googlecallback/GoogleCallback';

import './App.css';

/* ==================== Layout Todo App ==================== */
function AppLayout() {
  return (
    <TaskFormProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Routes>
            <Route path="main" element={<MainContent />} />
            <Route path="completed" element={<Completed />} />
            <Route path="overview" element={<TaskReport />} />
            <Route path="help" element={<Help />} />

            {/* ✅ Bổ sung các route con */}
            <Route path="today" element={<div>Today page (placeholder)</div>} />
            <Route path="upcoming" element={<div>Upcoming page (placeholder)</div>} />
            <Route path="search" element={<div>Search page (placeholder)</div>} />

            {/* ✅ Redirect /app → /app/main */}
            <Route index element={<Navigate to="main" replace />} />
          </Routes>
        </div>
        <TaskOverlay />
      </div>
    </TaskFormProvider>
  );
}

/* ==================== Layout Login ==================== */
function LoginLayout() {
  return (
    <div className="login-container">
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.35 }}
          className="login-left-motion"
        >
          <LoginForm />
        </motion.div>
      </AnimatePresence>
      <div className="login-right">
        <ImageSlider />
      </div>
    </div>
  );
}

function RegisterLayout() {
  return (
    <div className="login-container">
      <AnimatePresence mode="wait">
        <motion.div
          key="signup"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.35 }}
          className="login-left-motion"
        >
          <SignUpForm />
        </motion.div>
      </AnimatePresence>
      <div className="login-right">
        <ImageSlider />
      </div>
    </div>
  );
}

/* ==================== PrivateRoute ==================== */
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // ✅ đồng bộ key 'token'
  return token ? children : <Navigate to="/login" replace />;
}

/* ==================== App ==================== */
function App() {
  return (
    <Router>
      {/* Toast chung cho toàn app */}
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
        {/* Login & Register routes */}
        <Route path="/login" element={<LoginLayout />} />
        <Route path="/register" element={<RegisterLayout />} />
        <Route
          path="/forgot-password"
          element={
            <div className="centered-container">
              <ForgotPasswordForm />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div className="centered-container">
              <ResetPasswordForm />
            </div>
          }
        />
        <Route path="/google-callback" element={<GoogleCallback />} />

        {/* ✅ Redirect root "/" → /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Todo app layout - chỉ cho vào khi đã login */}
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;