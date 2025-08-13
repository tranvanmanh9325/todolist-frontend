import React, { useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./SelectDatePopup.css";

const SelectDatePopup = ({ selectedDate, onChange, onClose }) => {
  const popupRef = useRef();

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Chọn nhanh ngày
  const quickSelect = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    onChange(date);
    onClose();
  };

  const getThisWeekend = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    return date;
  };

  const getNextWeek = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilNextMonday = ((1 - day + 7) % 7) + 7;
    date.setDate(date.getDate() + daysUntilNextMonday);
    return date;
  };

  return (
    <div
      ref={popupRef}
      className="select-date-popup"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
      }}
    >
      {/* Ô nhập ngày */}
      <input
        type="text"
        className="date-input"
        placeholder="Type a date"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value) {
            const parsed = new Date(e.target.value);
            if (!isNaN(parsed)) {
              onChange(parsed);
              onClose();
            }
          }
        }}
      />

      {/* Quick options */}
      <div className="quick-options">
        <div className="today" onClick={() => quickSelect(0)}>
          <span className="icon">📅</span>
          <span className="label">Today</span>
        </div>
        <div className="tomorrow" onClick={() => quickSelect(1)}>
          <span className="icon">🌞</span>
          <span className="label">Tomorrow</span>
        </div>
        <div
          className="this-weekend"
          onClick={() => {
            onChange(getThisWeekend());
            onClose();
          }}
        >
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M16 6a3 3 0 0 1 3 3v1h.1c1 0 1.9 1 1.9 2v4c0 1-.8 2-1.9 2H18v.5a.5.5 0 0 1-1 0V18H7v.5a.5.5 0 0 1-1 0V18H5a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2V9a3 3 0 0 1 3-3zm3 5a1 1 0 0 0-1 .9V15H6v-3a1 1 0 0 0-2-.1V16c0 .5.4 1 .9 1H19a1 1 0 0 0 1-.9V12c0-.6-.4-1-1-1m-3-4H8c-1 0-2 .8-2 1.9v1.4c.6.3 1 1 1 1.7v2h10v-2a2 2 0 0 1 1-1.7V9c0-1-.8-2-1.9-2z"
              ></path>
            </svg>
          </span>
          <span className="label">This weekend</span>
        </div>
        <div
          className="next-week"
          onClick={() => {
            onChange(getNextWeek());
            onClose();
          }}
        >
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm8.354 4.647a.5.5 0 0 0-.708.707l1.647 1.647H8.5a.5.5 0 1 0 0 1h5.793l-1.647 1.646a.5.5 0 0 0 .708.707l2.5-2.5a.5.5 0 0 0 0-.707zM7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="label">Next week</span>
        </div>
      </div>

      {/* Lịch */}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          onChange(date);
          onClose();
        }}
      />

      {/* Footer */}
      <div className="date-footer">
        <button className="date-footer-btn">⏰ Time</button>
        <button className="date-footer-btn">🔁 Repeat</button>
      </div>
    </div>
  );
};

export default SelectDatePopup;