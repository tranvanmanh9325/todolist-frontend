import React, { useState, useEffect, useRef } from "react";
import "./FooterButton.css";

// Hàm tạo danh sách giờ theo bước 15 phút
const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

const FooterButtons = ({ onRepeatClick }) => {
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedTime, setSelectedTime] = useState("23:00");

  const timeOptions = generateTimeOptions();
  const dropdownRef = useRef(null);

  // Tự scroll đến giờ đang chọn khi mở dropdown
  useEffect(() => {
    if (showTimeDropdown && dropdownRef.current) {
      const active = dropdownRef.current.querySelector(".active-time");
      if (active) {
        active.scrollIntoView({ block: "center" });
      }
    }
  }, [showTimeDropdown]);

  return (
    <div className="date-footer" style={{ position: "relative" }}>
      {/* Nút Time */}
      <button
        className="date-footer-btn"
        onClick={() => setShowTimePopup((prev) => !prev)}
      >
        <span>Time</span>
      </button>

      {/* Popup */}
      {showTimePopup && (
        <div className="time-popup">
          {/* Time select custom */}
          <div className="time-popup-row">
            <label>Time</label>
            <div
              className="custom-time-select"
              onClick={() => setShowTimeDropdown((prev) => !prev)}
            >
              {selectedTime}
            </div>

            {showTimeDropdown && (
              <div className="time-dropdown" ref={dropdownRef}>
                {timeOptions.map((time) => (
                  <div
                    key={time}
                    className={`time-dropdown-item ${
                      time === selectedTime ? "active-time" : ""
                    }`}
                    onClick={() => {
                      setSelectedTime(time);
                      setShowTimeDropdown(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="time-popup-row">
            <label>Duration</label>
            <select defaultValue="none" className="duration-select">
              <option value="none">No duration</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
            </select>
          </div>

          {/* Footer */}
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
                console.log("Saved time:", selectedTime);
                setShowTimePopup(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Nút Repeat */}
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