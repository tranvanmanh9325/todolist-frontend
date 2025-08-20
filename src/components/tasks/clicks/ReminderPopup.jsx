import React from "react";
import "./ReminderPopup.css";

const ReminderPopup = ({ selectedReminder, setSelectedReminder, onSave, onClose }) => {
  const options = [
    { value: "0", label: "0 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },
  ];

  return (
    <div className="reminder-popup">
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
          onClick={() => {
            if (selectedReminder) {
              onSave(selectedReminder);
              onClose(); // đóng popup sau khi save
            }
          }}
          disabled={!selectedReminder}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;