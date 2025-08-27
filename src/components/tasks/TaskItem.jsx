import React, { useState, useRef, useEffect } from 'react';
import './TaskItem.css';
import TaskDropdown from './TaskDropdown';

const TaskItem = ({ task, onEdit, onToggleComplete, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hàm lấy màu priority giống trong TaskOptions
  const getPriorityColor = (level) => {
    switch (level) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'blue';
      case 4: return 'gray';
      default: return '#ccc';
    }
  };

  // Hàm lấy nhãn priority cho tooltip
  const getPriorityLabel = (level) => {
    switch (level) {
      case 1: return 'Priority 1';
      case 2: return 'Priority 2';
      case 3: return 'Priority 3';
      case 4: return 'Priority 4';
      default: return '';
    }
  };

  return (
    <div className="task-item">
      <div className="task-left">
        <div
          className="checkbox-wrapper"
          onClick={() => onToggleComplete(task.id, true)}
          title="Mark as completed"
        >
          <input type="checkbox" className="custom-checkbox" />
          <span className="custom-circle"></span>
        </div>
        <div className="task-text">
          <div className="task-title">
            {/* Hiển thị cờ ưu tiên nếu có */}
            {task.priority && (
              <span
                className="priority-flag"
                style={{ color: getPriorityColor(task.priority), marginRight: 6 }}
                title={getPriorityLabel(task.priority)}
              >
                ⚑
              </span>
            )}
            {task.title}
          </div>
          {/* 🔹 hiển thị description thay cho note */}
          {task.description && <div className="task-time">{task.description}</div>}
        </div>
      </div>

      <div className="task-right" style={{ position: 'relative' }}>
        <div className="task-actions-hover">
          <button className="task-icon-btn" title="Edit" onClick={() => onEdit(task)}>✏️</button>
          <button className="task-icon-btn" title="Archive">📦</button>
          <button className="task-icon-btn" title="Comment">💬</button>
          <button
            className="task-icon-btn"
            title="More"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            ⋯
          </button>
        </div>
        {/* 🔹 hiển thị type thay cho project */}
        <span className="project-name">{task.type || 'Inbox'}</span>
        <span className="project-icon">📁</span>

        {showDropdown && (
          <div className="task-dropdown-wrapper" ref={dropdownRef}>
            <TaskDropdown
              onClose={() => setShowDropdown(false)}
              onEdit={() => {
                setShowDropdown(false);
                onEdit(task);
              }}
              onDelete={() => {
                setShowDropdown(false);
                onDelete(task.id);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;