import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import "./SelectDatePopup.css";
import CustomDatePicker from "./clicks/CustomDatePicker";
import QuickDateOptions from "./clicks/QuickDateOptions";
import FooterButtons from "./clicks/FooterButtons"; // ⬅️ import mới

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

// ✅ Hàm parse input thành Date
const parseDateFromInput = (value) => {
  if (!value) return null;
  const today = new Date();
  const lower = value.toLowerCase();

  // Bắt đầu bằng chữ
  if (/^[a-zA-Z]/.test(value)) {
    if (lower === "today") return today;
    if (lower === "tomorrow") {
      const d = new Date(today);
      d.setDate(today.getDate() + 1);
      return d;
    }
    if (lower.startsWith("next week")) {
      const d = new Date(today);
      let day = d.getDay();
      let daysUntilNextMonday = (1 - day + 7) % 7;
      if (daysUntilNextMonday === 0) daysUntilNextMonday = 7;
      d.setDate(d.getDate() + daysUntilNextMonday);
      return d;
    }
    if (lower.startsWith("next weekend")) {
      const d = new Date(today);
      let day = d.getDay();
      let daysUntilNextSat = ((6 - day + 7) % 7) + 7;
      d.setDate(d.getDate() + daysUntilNextSat);
      return d;
    }
    return null;
  }

  // Bắt đầu bằng số
  if (/^\d/.test(value)) {
    const hasYear = /\b\d{4}\b/.test(value);
    const valueWithYear = hasYear ? value : `${value} ${today.getFullYear()}`;
    const d = new Date(valueWithYear);
    return !isNaN(d) ? d : null;
  }

  return null;
};

const SelectDatePopup = ({ selectedDate, onChange, onClose, isOpen = true }) => {
  const popupRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [previewDate, setPreviewDate] = useState(null);

  // đồng bộ input với selectedDate
  useEffect(() => {
    setInputValue(selectedDate ? formatShortDate(selectedDate) : "");
    setNoResults(false);
    setPreviewDate(null);
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

  // xử lý Enter
  const handleInputKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (previewDate) {
      onChange(previewDate);
      setInputValue(formatShortDate(previewDate));
      setNoResults(false);
      setPreviewDate(null);
      onClose();
    } else {
      setNoResults(true);
    }
  };

  // xử lý thay đổi input
  const handleInputChange = (value) => {
    setInputValue(value);
    setNoResults(false);
    setPreviewDate(null);

    if (!value.trim()) return;

    const parsed = parseDateFromInput(value);
    if (parsed) {
      setPreviewDate(parsed);
    } else {
      setNoResults(true);
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
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />

          {/* Preview suggestion */}
          {previewDate && !noResults && (
            <div
              className="date-suggestion"
              onClick={() => {
                onChange(previewDate);
                setInputValue(formatShortDate(previewDate));
                setPreviewDate(null);
                onClose();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm12 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
                />
              </svg>
              <div className="date-suggestion-text">
                <strong>
                  {previewDate.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                  })}
                </strong>
                <span>No tasks</span>
              </div>
            </div>
          )}

          {/* No results */}
          {noResults && (
            <div className="no-results">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm12 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
                  clipRule="evenodd"
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
          <FooterButtons
            onTimeClick={() => console.log("Time clicked")}
            onRepeatClick={() => console.log("Repeat clicked")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectDatePopup;