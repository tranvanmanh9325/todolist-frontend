import React, { useEffect, useRef } from "react";
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

const SelectDatePopup = ({ selectedDate, onChange, onClose, isOpen = true }) => {
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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

          {/* Truyền selectedDate xuống QuickDateOptions */}
          <QuickDateOptions
            selectedDate={selectedDate}
            onChange={onChange}
            onClose={onClose}
          />

          <div className="options-separator" aria-hidden="true" />

          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={onChange}
            onClose={onClose}
          />

          <div className="date-footer">
            <button
              className="date-footer-btn"
              style={{ display: "flex", alignItems: "center" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M13.5 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0m1 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-6-2.5a.5.5 0 0 0-1 0v3A.5.5 0 0 0 8 9h3a.5.5 0 0 0 0-1H8.5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span style={{ marginLeft: "4px" }}>Time</span>
            </button>
            <button
              className="date-footer-btn"
              style={{ display: "flex", alignItems: "center" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M9.5 4H6a.5.5 0 0 1 0-1h3.5a3 3 0 0 1 3 3v1.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L11.5 7.793V6a2 2 0 0 0-2-2M7.354 9.354a.5.5 0 0 1-.708 0L5.5 8.207V10a2 2 0 0 0 2 2H11a.5.5 0 0 1 0 1H7.5a3 3 0 0 1-3-3V8.207L3.354 9.354a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span style={{ marginLeft: "4px" }}>Repeat</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectDatePopup;