import React, { useEffect, useState } from "react";
import "./ReminderPopup.css";

const ReminderPopup = ({ anchorRef, onSave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedReminder, setSelectedReminder] = useState("0"); // giá trị mặc định

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

  const handleSave = () => {
    onSave(selectedReminder);
  };

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
      </div>

      {/* Content */}
      <div className="reminder-content">
        <label className="reminder-option">
          <input
            type="radio"
            name="reminder"
            value="0"
            checked={selectedReminder === "0"}
            onChange={(e) => setSelectedReminder(e.target.value)}
          />
          <span className="reminder-label">0 minutes before</span>
          {selectedReminder === "0" && <span className="checkmark">✔</span>}
        </label>

        <label className="reminder-option">
          <input
            type="radio"
            name="reminder"
            value="30"
            checked={selectedReminder === "30"}
            onChange={(e) => setSelectedReminder(e.target.value)}
          />
          <span className="reminder-label">30 minutes before</span>
          {selectedReminder === "30" && <span className="checkmark">✔</span>}
        </label>

        <label className="reminder-option">
          <input
            type="radio"
            name="reminder"
            value="60"
            checked={selectedReminder === "60"}
            onChange={(e) => setSelectedReminder(e.target.value)}
          />
          <span className="reminder-label">1 hour before</span>
          {selectedReminder === "60" && <span className="checkmark">✔</span>}
        </label>

        <label className="reminder-option">
          <input
            type="radio"
            name="reminder"
            value="120"
            checked={selectedReminder === "120"}
            onChange={(e) => setSelectedReminder(e.target.value)}
          />
          <span className="reminder-label">2 hours before</span>
          {selectedReminder === "120" && <span className="checkmark">✔</span>}
        </label>
      </div>

      <hr className="divider" />

      {/* Footer */}
      <div className="reminder-footer">
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;