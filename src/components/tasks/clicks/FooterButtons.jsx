import React, { useState, useEffect, useRef } from "react";
import { format, setHours, setMinutes } from "date-fns";
import "./FooterButton.css";

// Hàm tạo danh sách giờ theo bước 15 phút (dạng Date object)
const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push(setHours(setMinutes(new Date(), m), h));
    }
  }
  return times;
};

// Hàm lấy giờ mặc định sát với hiện tại (làm tròn lên 15 phút)
const getNearestQuarterHour = () => {
  const now = new Date();
  let minutes = now.getMinutes();
  let hours = now.getHours();

  const roundedMinutes = Math.ceil(minutes / 15) * 15;

  if (roundedMinutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  } else {
    minutes = roundedMinutes;
  }

  return setHours(setMinutes(new Date(), minutes), hours);
};

const FooterButtons = ({ onRepeatClick, onSave }) => {
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedTime, setSelectedTime] = useState(getNearestQuarterHour());
  const [selectedDuration, setSelectedDuration] = useState("none");

  const timeOptions = generateTimeOptions();
  const dropdownRef = useRef(null);

  // Mỗi lần mở popup thì reset lại giờ mặc định
  useEffect(() => {
    if (showTimePopup) {
      setSelectedTime(getNearestQuarterHour());
      setShowTimeDropdown(false); // reset dropdown khi mở popup mới
    }
  }, [showTimePopup]);

  // Tự scroll đến giờ đang chọn khi mở dropdown
  useEffect(() => {
    if (showTimeDropdown && dropdownRef.current) {
      const active = dropdownRef.current.querySelector(".active-time");
      if (active) {
        active.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [showTimeDropdown, selectedTime]);

  const handleSave = () => {
    onSave &&
      onSave({
        time: selectedTime || null, // ✅ giữ nguyên Date object
        duration: selectedDuration,
      });
    setShowTimeDropdown(false);
    setShowTimePopup(false);
  };

  return (
    <div className="date-footer" style={{ position: "relative" }}>
      {/* Nút Time */}
      <button
        type="button"
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
              {selectedTime ? format(selectedTime, "HH:mm") : "Time"}
            </div>

            {showTimeDropdown && (
              <div className="time-dropdown" ref={dropdownRef}>
                {timeOptions.map((time) => (
                  <div
                    key={time.getTime()}
                    className={`time-dropdown-item ${
                      format(time, "HH:mm") === format(selectedTime, "HH:mm")
                        ? "active-time"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedTime(time);
                      setShowTimeDropdown(false);
                    }}
                  >
                    {format(time, "HH:mm")}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="time-popup-row">
            <label>Duration</label>
            <select
              value={selectedDuration}
              className="duration-select"
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <option value="none">No duration</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
            </select>
          </div>

          {/* Footer */}
          <div className="time-popup-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowTimeDropdown(false);
                setShowTimePopup(false);
              }}
            >
              Cancel
            </button>
            <button type="button" className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* Nút Repeat */}
      <button type="button" className="date-footer-btn" onClick={onRepeatClick}>
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