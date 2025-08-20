import React, { useState, useEffect, useRef } from "react";
import { format, setHours, setMinutes, addMinutes } from "date-fns";
import "./FooterButton.css";

// ✅ Hàm lấy mốc 15 phút kế tiếp
const getNextQuarterHour = () => {
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

// ✅ Hàm sinh danh sách giờ 24h (96 mốc, cách nhau 15 phút)
const generateTimeOptions = (start) => {
  const times = [];
  let current = new Date(start);

  for (let i = 0; i < 96; i++) {
    times.push(new Date(current));
    current = addMinutes(current, 15);
  }

  return times;
};

const durationOptions = [
  { value: "none", label: "No duration" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
];

const FooterButtons = ({
  onRepeatClick,
  onSave,
  initialTime,
  initialDuration,
  selectedTime: propTime, // chỉ nhận time từ cha để hiển thị nút
}) => {
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showRepeatPopup, setShowRepeatPopup] = useState(false);

  // ✅ State nội bộ khi mở popup
  const [selectedTime, setSelectedTime] = useState(
    initialTime || getNextQuarterHour()
  );
  const [selectedDuration, setSelectedDuration] = useState(
    initialDuration || "none"
  );

  const [timeOptions, setTimeOptions] = useState(
    generateTimeOptions(getNextQuarterHour())
  );

  const timeDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const repeatPopupRef = useRef(null);

  // ✅ Cập nhật lại danh sách giờ mỗi khi mở popup
  useEffect(() => {
    if (showTimePopup) {
      const start = getNextQuarterHour();
      setTimeOptions(generateTimeOptions(start));
      setSelectedTime(initialTime || start);
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
      const active =
        durationDropdownRef.current.querySelector(".active-duration");
      if (active) {
        active.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [showDurationDropdown, selectedDuration]);

  // ✅ Đóng popup Repeat khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (repeatPopupRef.current && !repeatPopupRef.current.contains(e.target)) {
        setShowRepeatPopup(false);
      }
    };
    if (showRepeatPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRepeatPopup]);

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

  const handleClearTime = (e) => {
    e.stopPropagation(); // tránh mở popup khi bấm ❌
    setSelectedTime(null);
    setSelectedDuration("none");
    onSave &&
      onSave({
        time: null,
        duration: "none",
      });
  };

  // ✅ Label hiển thị trên nút Time (chỉ Time)
  const getTimeLabel = () => {
    if (propTime instanceof Date) {
      return format(propTime, "HH:mm");
    }
    return "Time";
  };

  // ✅ Các option Repeat (main + sub)
  const repeatOptions = [
    { value: "daily", main: "Every day" },
    { value: "weekly", main: "Every week", sub: `on ${format(new Date(), "EEEE")}` },
    { value: "weekday", main: "Every weekday", sub: "(Mon – Fri)" },
    { value: "monthly", main: "Every month", sub: `on the ${format(new Date(), "do")}` },
    { value: "yearly", main: "Every year", sub: `on ${format(new Date(), "MMMM do")}` },
  ];

  const handleSelectRepeat = (value) => {
    setShowRepeatPopup(false);
    onRepeatClick && onRepeatClick(value);
  };

  return (
    <div className="date-footer" style={{ position: "relative" }}>
      {/* Nút Time */}
      <button
        type="button"
        className="date-footer-btn time-btn-with-clear"
        onClick={() => setShowTimePopup((prev) => !prev)}
      >
        <span className="time-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5m0 1.5a8.75 8.75 0 1 1 0 17.5 8.75 8.75 0 0 1 0-17.5m.75 4.5a.75.75 0 0 0-1.5 0v4.69c0 .2.08.39.22.53l3.25 3.25a.75.75 0 0 0 1.06-1.06l-3.03-3.03z"
            />
          </svg>
          <span>{getTimeLabel()}</span>
        </span>

        {propTime instanceof Date && (
          <span
            className="clear-time-btn"
            onClick={handleClearTime}
            title="Clear time"
          >
            ×
          </span>
        )}
      </button>

      {/* Popup chọn Time + Duration */}
      {showTimePopup && (
        <div className="time-popup">
          {/* Time select */}
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
                      selectedTime &&
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

          {/* Duration select */}
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
      <button
        type="button"
        className="date-footer-btn"
        onClick={() => setShowRepeatPopup((prev) => !prev)}
      >
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

      {/* Popup Repeat */}
      {showRepeatPopup && (
        <div className="repeat-popup" ref={repeatPopupRef}>
          {repeatOptions.map((opt) => (
            <div
              key={opt.value}
              className="repeat-item"
              onClick={() => handleSelectRepeat(opt.value)}
            >
              <span>{opt.main}</span>
              {opt.sub && <span className="repeat-subtext"> {opt.sub}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterButtons;