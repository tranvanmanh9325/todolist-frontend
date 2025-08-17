import React, { useState } from "react";
import "./FooterButton.css";

const FooterButtons = ({ onRepeatClick }) => {
  const [showTimePopup, setShowTimePopup] = useState(false);

  return (
    <div className="date-footer" style={{ position: "relative" }}>
      {/* Time button */}
      <button
        className="date-footer-btn"
        onClick={() => setShowTimePopup((prev) => !prev)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M13.5 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0m1 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-6-2.5a.5.5 0 0 0-1 0v3A.5.5 0 0 0 8 9h3a.5.5 0 0 0 0-1H8.5z"
            clipRule="evenodd"
          />
        </svg>
        <span>Time</span>
      </button>

      {/* Popup hiển thị khi bấm Time */}
      {showTimePopup && (
        <div className="time-popup">
          <div className="time-popup-row">
            <label>Time</label>
            <input type="time" defaultValue="23:00" />
          </div>

          <div className="time-popup-row">
            <label>Duration</label>
            <select defaultValue="none">
              <option value="none">No duration</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
            </select>
          </div>

          <div className="time-popup-row">
            <label>Time zone</label>
            <select defaultValue="floating">
              <option value="floating">Floating time</option>
              <option value="utc">UTC</option>
              <option value="gmt+7">GMT+7</option>
            </select>
          </div>

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

      {/* Repeat button */}
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