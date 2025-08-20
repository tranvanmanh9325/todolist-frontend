import React, { useEffect, useState } from "react";
import "./ReminderPopup.css";

const ReminderPopup = ({ anchorRef, onClose, onSave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Tính toán vị trí popup ngay dưới nút Reminders
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 6, // cách nút 6px
        left: rect.left + window.scrollX,      // canh trái theo nút
      });
    }
  }, [anchorRef]);

  return (
    <div
      className="reminder-popup"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 4000,
      }}
    >
      {/* Header */}
      <div className="reminder-header">
        <span className="reminder-title">Reminders</span>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="reminder-content">
        <div className="reminder-item">
          <span className="reminder-icon">⏰</span>
          <span className="reminder-text">0m before</span>
          <button className="clear-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <hr className="divider" />

      {/* Footer */}
      <div className="reminder-footer">
        <span className="help-icon">❓</span>
        <button className="save-btn" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;