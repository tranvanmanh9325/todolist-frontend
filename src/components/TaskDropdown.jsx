import React from 'react';
import './TaskDropdown.css';

const TaskDropdown = ({ onClose, onEdit, onDelete }) => {
  return (
    <div className="task-dropdown" onMouseLeave={onClose}>
      <div className="dropdown-item">⬆️ Add task above</div>
      <div className="dropdown-item">⬇️ Add task below</div>
      <hr />
      <div className="dropdown-item" onClick={onEdit}>
        ✏️ Edit <span className="shortcut">Ctrl E</span>
      </div>
      <hr />
      <div className="dropdown-section">
        <div className="dropdown-title">Date</div>
        <div className="dropdown-icons">
          <span title="Today">📅</span>
          <span title="Sun">☀️</span>
          <span title="Tomorrow">➡️</span>
          <span title="Weekend">🛋️</span>
          <span title="More">⋯</span>
        </div>
      </div>
      <div className="dropdown-section">
        <div className="dropdown-title">Priority</div>
        <div className="dropdown-icons">
          <span title="High">🚩</span>
          <span title="Medium">🟧</span>
          <span title="Low">🟦</span>
          <span title="None">🏳️</span>
        </div>
      </div>
      <hr />
      <div className="dropdown-item">⏰ Reminders</div>
      <div className="dropdown-item">📂 Move to... <span className="shortcut">V</span></div>
      <div className="dropdown-item">➕ Duplicate</div>
      <div className="dropdown-item">🔗 Copy link to task <span className="shortcut">Ctrl C</span></div>
      <div className="dropdown-item">🧩 Add extension...</div>
      <hr />
      <div className="dropdown-item delete" onClick={onDelete}>
        🗑️ Delete <span className="shortcut">Delete</span>
      </div>
    </div>
  );
};

export default TaskDropdown;