import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebars/Sidebar';
import MainContent from './components/routermain/MainContent';
import Completed from './components/routermain/Completed';
import TaskOverlay from './components/tasks/TaskOverlay';
import TaskReport from './components/tasks/TaskReport';
import Help from './components/Help'; // ✅ thêm Help component
import { TaskFormProvider } from './contexts/TaskFormContext';
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
              <Route path="/overview" element={<TaskReport />} />
              <Route path="/help" element={<Help />} /> {/* ✅ route mới */}
            </Routes>
          </div>

          {/* Overlay hiển thị TaskForm từ Sidebar */}
          <TaskOverlay />
        </div>
      </TaskFormProvider>
    </Router>
  );
}

export default App;