// src/components/tasks/CustomDatePicker.jsx
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./CustomDatePicker.css";

const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
  return (
    <div className="custom-date-picker">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          onChange(date);
          if (onClose) onClose();
        }}
      />
    </div>
  );
};

export default CustomDatePicker;