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
          <div className="task-title">{task.title}</div>
          {task.note && <div className="task-time">{task.note}</div>}
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
        <span className="project-name">{task.project || 'Inbox'}</span>
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