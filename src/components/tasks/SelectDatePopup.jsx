import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import "./SelectDatePopup.css";
import CustomDatePicker from "./clicks/CustomDatePicker";
import QuickDateOptions from "./clicks/QuickDateOptions";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -8,
    transition: { duration: 0.15 }
  }
};

// format ngày ngắn: "16 Aug"
const formatShortDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });
};

const SelectDatePopup = ({ selectedDate, onChange, onClose, isOpen = true }) => {
  const popupRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [noResults, setNoResults] = useState(false);

  // đồng bộ input với selectedDate
  useEffect(() => {
    setInputValue(selectedDate ? formatShortDate(selectedDate) : "");
    setNoResults(false);
  }, [selectedDate]);

  // đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // xử lý Enter trong input
  const handleInputKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const value = e.target.value.trim();

    // Nếu input trống -> bỏ chọn ngày
    if (!value) {
      onChange(null);
      setInputValue("");
      setNoResults(false);
      onClose();
      return;
    }

    const today = new Date();
    let parsed = null;
    const lower = value.toLowerCase();

    // keyword đặc biệt
    if (lower === "today") {
      parsed = today;
    } else if (lower === "tomorrow") {
      parsed = new Date(today);
      parsed.setDate(today.getDate() + 1);
    } else if (lower.startsWith("next week")) {
      parsed = new Date(today);
      let day = parsed.getDay();
      let daysUntilNextMonday = (1 - day + 7) % 7;
      if (daysUntilNextMonday === 0) daysUntilNextMonday = 7;
      parsed.setDate(parsed.getDate() + daysUntilNextMonday);
    } else if (lower.startsWith("next weekend")) {
      parsed = new Date(today);
      let day = parsed.getDay();
      let daysUntilNextSat = ((6 - day + 7) % 7) + 7;
      parsed.setDate(parsed.getDate() + daysUntilNextSat);
    } else if (
      ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].some(
        (d) => lower.includes(d)
      )
    ) {
      const daysOfWeek = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      const targetDay = Object.entries(daysOfWeek).find(([k]) =>
        lower.includes(k)
      )[1];
      parsed = new Date(today);
      let diff = (targetDay - today.getDay() + 7) % 7;
      if (diff === 0) diff = 7;
      parsed.setDate(parsed.getDate() + diff);
    } else {
      // nếu user chỉ nhập "25 Aug" thì thêm năm hiện tại
      const hasYear = /\b\d{4}\b/.test(value);
      const valueWithYear = hasYear ? value : `${value} ${today.getFullYear()}`;
      const tempDate = new Date(valueWithYear);

      // ✅ chỉ gán parsed nếu thực sự hợp lệ
      if (tempDate instanceof Date && !isNaN(tempDate.getTime())) {
        parsed = tempDate;
      } else {
        parsed = null;
      }
    }

    // ✅ kiểm tra valid
    if (parsed && parsed instanceof Date && !isNaN(parsed.getTime())) {
      onChange(parsed);
      setInputValue(formatShortDate(parsed));
      setNoResults(false);
      onClose();
    } else {
      setNoResults(true); // hiện No results nếu không parse được
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          className="select-date-popup"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Input */}
          <input
            type="text"
            className="date-input"
            placeholder="Type a date"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setNoResults(false); // reset khi đang gõ
            }}
            onKeyDown={handleInputKeyDown}
          />

          {/* Hiện No results nếu nhập sai */}
          {noResults && (
            <div className="no-results">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-.75-5.5h1.5v1.5h-1.5zm0-8h1.5v6h-1.5z"
                />
              </svg>
              <span>No results</span>
            </div>
          )}

          {/* Quick options */}
          <QuickDateOptions
            selectedDate={selectedDate}
            onChange={onChange}
            onClose={onClose}
          />

          <div className="options-separator" aria-hidden="true" />

          {/* Date picker */}
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={onChange}
            onClose={onClose}
          />

          {/* Footer */}
          <div className="date-footer">
            <button className="date-footer-btn">
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
            <button className="date-footer-btn">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectDatePopup;