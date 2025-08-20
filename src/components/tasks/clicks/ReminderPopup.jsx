import React, { useEffect, useState } from "react";
import "./ReminderPopup.css";

const ReminderPopup = ({ anchorRef, onSave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedReminder, setSelectedReminder] = useState(""); // mặc định chưa chọn gì

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
    if (selectedReminder) {
      onSave(selectedReminder);
    }
  };

  const options = [
    { value: "0", label: "0 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },
  ];

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
        {options.map((option) => (
          <label key={option.value} className="reminder-option">
            <input
              type="radio"
              name="reminder"
              value={option.value}
              checked={selectedReminder === option.value}
              onChange={(e) => setSelectedReminder(e.target.value)}
            />
            <span className="reminder-label">{option.label}</span>
            {selectedReminder === option.value && (
              <span className="checkmark">✔</span>
            )}
          </label>
        ))}
      </div>

      <hr className="divider" />

      {/* Footer */}
      <div className="reminder-footer">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={!selectedReminder} // disable khi chưa chọn
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;