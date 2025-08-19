import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { setHours, setMinutes } from "date-fns";
import "./SelectDatePopup.css";
import CustomDatePicker from "./clicks/CustomDatePicker";
import QuickDateOptions from "./clicks/QuickDateOptions";
import FooterButtons from "./clicks/FooterButtons";
import DateInput from "./clicks/DateInput"; // ⬅️ input tách riêng

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

const SelectDatePopup = ({
  selectedDate,
  selectedTime: propTime,
  selectedDuration: propDuration,
  onChange,
  onClose,
  isOpen = true,
}) => {
  const popupRef = useRef();

  // state local cho time + duration
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  // ⏺ Đồng bộ props -> state khi mở popup
  useEffect(() => {
    setSelectedTime(
      propTime instanceof Date && !isNaN(propTime) ? propTime : null
    );
    setSelectedDuration(propDuration || null);
  }, [propTime, propDuration, isOpen]);

  // ⏺ đóng popup khi click ngoài
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
          {/* Input đã tách riêng */}
          <DateInput
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onChange={({ date, time }) => {
              onChange({ date, time, duration: selectedDuration });
            }}
            onClose={onClose}
          />

          {/* Quick options */}
          <QuickDateOptions
            selectedDate={selectedDate}
            onChange={(date) => {
              if (date === null) {
                // ✅ Khi chọn No Date → reset time & duration
                setSelectedTime(null);
                setSelectedDuration("none");
                onChange({ date: null, time: null, duration: "none" });
              } else {
                onChange({
                  date,
                  time: selectedTime,
                  duration: selectedDuration || "none",
                });
              }
            }}
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
            initialTime={selectedTime}           // ✅ truyền xuống
            initialDuration={selectedDuration}   // ✅ truyền xuống
            onRepeatClick={() => console.log("Repeat clicked")}
            onSave={({ time, duration }) => {
              setSelectedTime(time);
              setSelectedDuration(duration);

              let finalDate = selectedDate;

              // ✅ Nếu chưa có ngày mà chọn time trước
              if (!selectedDate && time instanceof Date) {
                const now = new Date();
                finalDate = new Date();
                finalDate.setHours(0, 0, 0, 0);

                // Nếu giờ chọn < giờ hiện tại => tự động sang ngày mai
                if (
                  time.getHours() < now.getHours() ||
                  (time.getHours() === now.getHours() &&
                    time.getMinutes() <= now.getMinutes())
                ) {
                  finalDate.setDate(finalDate.getDate() + 1);
                }
              }

              // Nếu có cả date + time thì hợp nhất
              if (finalDate && time instanceof Date) {
                finalDate = setHours(
                  setMinutes(new Date(finalDate), time.getMinutes()),
                  time.getHours()
                );
              }

              onChange &&
                onChange({
                  date: finalDate,
                  time: time instanceof Date ? time : null,
                  duration,
                });
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectDatePopup;