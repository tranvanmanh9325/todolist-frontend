import React, { useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./SelectDatePopup.css";

const SelectDatePopup = ({ anchorRef, selectedDate, onChange, onClose }) => {
  const popupRef = useRef();

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  const anchorRect = anchorRef.current?.getBoundingClientRect();

  // Hàm chọn nhanh ngày
  const quickSelect = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    onChange(date);
    onClose();
  };

  // Tính ngày "This weekend" (thứ 7 tuần này)
  const getThisWeekend = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    return date;
  };

  // Tính ngày "Next week" (thứ 2 tuần sau)
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
        top: anchorRect ? anchorRect.bottom + window.scrollY + 4 : 0,
        left: anchorRect ? anchorRect.left + window.scrollX : 0,
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
        <div onClick={() => quickSelect(0)}>📅 Today</div>
        <div onClick={() => quickSelect(1)}>🌞 Tomorrow</div>
        <div onClick={() => onChange(getThisWeekend())}>🖥 This weekend</div>
        <div onClick={() => onChange(getNextWeek())}>📅 Next week</div>
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

      {/* Nút Time và Repeat */}
      <div className="date-footer">
        <button className="date-footer-btn">⏰ Time</button>
        <button className="date-footer-btn">🔁 Repeat</button>
      </div>
    </div>
  );
};

export default SelectDatePopup;