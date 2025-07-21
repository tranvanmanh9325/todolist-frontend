import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Completed from './components/Completed';
import TaskOverlay from './components/TaskOverlay'; // ✅ Import TaskOverlay
import { TaskFormProvider } from './contexts/TaskFormContext'; // ✅ Context
import './App.css';

function App() {
  return (
    <Router>
      <TaskFormProvider>
        <div className="app-container">
          {/* Sidebar bên trái */}
          <Sidebar />

          {/* Nội dung chính bên phải */}
          <div className="main-wrapper">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/completed" element={<Completed />} />
              {/* Thêm các route khác nếu cần */}
            </Routes>
          </div>

          {/* ✅ Overlay hiển thị TaskForm từ Sidebar */}
          <TaskOverlay />
        </div>
      </TaskFormProvider>
    </Router>
  );
}

export default App;