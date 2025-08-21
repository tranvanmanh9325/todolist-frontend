import React, { useEffect, useRef, useState } from "react";
import "./ReminderPopup.css";

const ReminderPopup = ({
  selectedReminder,
  onSave,
  onClose,
  selectedDate,
  selectedTime,
}) => {
  const popupRef = useRef(null);
  const [tempReminder, setTempReminder] = useState(selectedReminder || "");

  // 👉 update temp khi popup mở lại
  useEffect(() => {
    setTempReminder(selectedReminder || "");
  }, [selectedReminder]);

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Nếu chưa có Date hoặc Time thì hiện thông báo + Save disable
  if (!selectedDate || !selectedTime) {
    return (
      <div className="reminder-popup info-mode" ref={popupRef}>
        <div className="reminder-header">
          <span className="reminder-title">Reminders</span>
        </div>
        <div className="reminder-info">
          <span className="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path
                fill="currentColor"
                d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m0-1A5 5 0 1 1 8 3a5 5 0 0 1 0 10m.75-7.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-1.5 3a.75.75 0 1 1 1.5 0v2.5a.75.75 0 0 1-1.5 0z"
              ></path>
            </svg>
          </span>
          <span className="info-text">Add a date and time to the task first.</span>
        </div>

        <hr className="divider" />
        <div className="reminder-footer">
          <button type="button" className="save-btn" disabled>
            Save
          </button>
        </div>
      </div>
    );
  }

  // Options
  const options = [
    { value: "0", label: "0 minutes before" },
    { value: "30", label: "30 minutes before" },
    { value: "60", label: "1 hour before" },
    { value: "120", label: "2 hours before" },
  ];

  return (
    <div className="reminder-popup option-mode" ref={popupRef}>
      <div className="reminder-header">
        <span className="reminder-title">Reminders</span>
      </div>

      <div className="reminder-content">
        {options.map((option) => (
          <label key={option.value} className="reminder-option">
            <input
              type="radio"
              name="reminder"
              value={option.value}
              checked={tempReminder === option.value}
              onChange={(e) => setTempReminder(e.target.value)}
            />
            <span className="reminder-label">{option.label}</span>
            {tempReminder === option.value && (
              <span className="checkmark">✔</span>
            )}
          </label>
        ))}
      </div>

      <hr className="divider" />

      <div className="reminder-footer">
        <button
          type="button"  // ✅ tránh submit form
          className="save-btn"
          onClick={() => {
            if (tempReminder) {
              onSave(tempReminder); // chỉ lưu khi bấm Save
              onClose();
            }
          }}
          disabled={!tempReminder}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;