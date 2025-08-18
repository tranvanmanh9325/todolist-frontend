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

const durationOptions = [
  { value: "none", label: "No duration" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
];

const FooterButtons = ({ onRepeatClick, onSave, initialTime, initialDuration }) => {
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  // ✅ Khởi tạo state từ props
  const [selectedTime, setSelectedTime] = useState(initialTime || getNearestQuarterHour());
  const [selectedDuration, setSelectedDuration] = useState(initialDuration || "none");

  const timeOptions = generateTimeOptions();
  const timeDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);

  // ✅ Khi mở popup thì load lại từ props thay vì reset cứng
  useEffect(() => {
    if (showTimePopup) {
      setSelectedTime(initialTime || getNearestQuarterHour());
      setSelectedDuration(initialDuration || "none");
      setShowTimeDropdown(false);
      setShowDurationDropdown(false);
    }
  }, [showTimePopup, initialTime, initialDuration]);

  // Tự scroll đến giờ đang chọn khi mở dropdown
  useEffect(() => {
    if (showTimeDropdown && timeDropdownRef.current) {
      const active = timeDropdownRef.current.querySelector(".active-time");
      if (active) {
        active.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [showTimeDropdown, selectedTime]);

  // Tự scroll đến duration đang chọn
  useEffect(() => {
    if (showDurationDropdown && durationDropdownRef.current) {
      const active = durationDropdownRef.current.querySelector(".active-duration");
      if (active) {
        active.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [showDurationDropdown, selectedDuration]);

  const handleSave = () => {
    onSave &&
      onSave({
        time: selectedTime || null,
        duration: selectedDuration,
      });
    setShowTimeDropdown(false);
    setShowDurationDropdown(false);
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
              onClick={() => {
                setShowTimeDropdown((prev) => !prev);
                setShowDurationDropdown(false);
              }}
            >
              {selectedTime ? format(selectedTime, "HH:mm") : "Time"}
            </div>

            {showTimeDropdown && (
              <div className="time-dropdown" ref={timeDropdownRef}>
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

          {/* Duration select custom */}
          <div className="time-popup-row">
            <label>Duration</label>
            <div
              className="custom-time-select"
              onClick={() => {
                setShowDurationDropdown((prev) => !prev);
                setShowTimeDropdown(false);
              }}
            >
              {durationOptions.find((d) => d.value === selectedDuration)?.label}
            </div>

            {showDurationDropdown && (
              <div className="time-dropdown" ref={durationDropdownRef}>
                {durationOptions.map((d) => (
                  <div
                    key={d.value}
                    className={`time-dropdown-item ${
                      d.value === selectedDuration ? "active-duration" : ""
                    }`}
                    onClick={() => {
                      setSelectedDuration(d.value);
                      setShowDurationDropdown(false);
                    }}
                  >
                    {d.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="time-popup-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowTimeDropdown(false);
                setShowDurationDropdown(false);
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