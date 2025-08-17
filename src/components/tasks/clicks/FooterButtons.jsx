import React, { useState } from "react";
import "./FooterButton.css";

const FooterButtons = ({ onRepeatClick }) => {
  const [showTimePopup, setShowTimePopup] = useState(false);

  return (
    <div className="date-footer" style={{ position: "relative" }}>
      {/* Time button (đã bỏ icon đồng hồ) */}
      <button
        className="date-footer-btn"
        onClick={() => setShowTimePopup((prev) => !prev)}
      >
        <span>Time</span>
      </button>

      {/* Popup hiển thị khi bấm Time */}
      {showTimePopup && (
        <div className="time-popup">
          {/* Time input */}
          <div className="time-popup-row">
            <label>Time</label>
            <input
              type="time"
              defaultValue="23:00"
              className="time-input"
            />
          </div>

          {/* Duration select */}
          <div className="time-popup-row">
            <label>Duration</label>
            <select defaultValue="none" className="duration-select">
              <option value="none">No duration</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div className="time-popup-footer">
            <button
              className="cancel-btn"
              onClick={() => setShowTimePopup(false)}
            >
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={() => {
                console.log("Saved time!");
                setShowTimePopup(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Repeat button (vẫn giữ nguyên icon) */}
      <button className="date-footer-btn" onClick={onRepeatClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M9.5 4H6a.5.5 0 0 1 0-1h3.5a3 3 0 0 1 3 3v1.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L11.5 7.793V6a2 2 0 0 0-2-2M7.354 9.354a.5.5 0 0 1-.708 0L5.5 8.207V10a2 2 0 0 0 2 2H11a.5.5 0 0 1 0 1H7.5a3 3 0 0 1-3-3V8.207L3.354 9.354a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708"
            clipRule="evenodd"
          />
        </svg>
        <span>Repeat</span>
      </button>
    </div>
  );
};

export default FooterButtons;