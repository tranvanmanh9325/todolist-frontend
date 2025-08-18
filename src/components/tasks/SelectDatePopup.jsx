import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { format, setHours, setMinutes } from "date-fns";
import "./SelectDatePopup.css";
import CustomDatePicker from "./clicks/CustomDatePicker";
import QuickDateOptions from "./clicks/QuickDateOptions";
import FooterButtons from "./clicks/FooterButtons";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -8,
    transition: { duration: 0.15 },
  },
};

// ✅ format dd/mm/yyyy + HH:mm (nếu có)
const formatFullDateTime = (date, time) => {
  if (!date) return "";
  const d = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return time instanceof Date ? `${d} ${format(time, "HH:mm")}` : d;
};

// ✅ parse input text thành Date
const parseDateFromInput = (value) => {
  if (!value) return null;
  const today = new Date();
  const lower = value.toLowerCase();

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

  // state cho time + duration
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  // đồng bộ input với selectedDate + selectedTime
  useEffect(() => {
    setInputValue(formatFullDateTime(selectedDate, selectedTime));
    setNoResults(false);
    setPreviewDate(null);
  }, [selectedDate, selectedTime]);

  // đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Xử lý Enter
  const handleInputKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (previewDate) {
      onChange({
        date: previewDate,
        time: selectedTime,
        duration: selectedDuration,
      });
      setInputValue(formatFullDateTime(previewDate, selectedTime));
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
                onChange({
                  date: previewDate,
                  time: selectedTime,
                  duration: selectedDuration,
                });
                setInputValue(formatFullDateTime(previewDate, selectedTime));
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
                    month: "short",
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
            onChange={(date) =>
              onChange({ date, time: selectedTime, duration: selectedDuration })
            }
            onClose={onClose}
          />

          <div className="options-separator" aria-hidden="true" />

          {/* Date picker */}
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={(date) =>
              onChange({ date, time: selectedTime, duration: selectedDuration })
            }
            onClose={onClose}
          />

          {/* Footer */}
          <FooterButtons
            onRepeatClick={() => console.log("Repeat clicked")}
            onSave={({ time, duration }) => {
              setSelectedTime(time);
              setSelectedDuration(duration);

              // Nếu có cả date + time thì hợp nhất thành 1 Date object
              let finalDate = selectedDate;
              if (selectedDate && time instanceof Date) {
                finalDate = setHours(
                  setMinutes(new Date(selectedDate), time.getMinutes()),
                  time.getHours()
                );
              }

              onChange &&
                onChange({
                  date: finalDate,
                  time: time instanceof Date ? time : null,
                  duration,
                });

              setInputValue(formatFullDateTime(finalDate, time));
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectDatePopup;