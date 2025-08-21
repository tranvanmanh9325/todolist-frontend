import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "./DateInput.css";

// ✅ format dd/MM/yyyy + HH:mm + duration + repeat
const formatFullDateTime = (date, time, duration, repeat) => {
  if (!date) return "";

  // ngày dạng dd/MM/yyyy
  let result = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // thêm time
  if (time instanceof Date && !isNaN(time)) {
    result += ` · ${format(time, "HH:mm")}`;
  }

  // thêm duration
  if (duration && duration !== "none") {
    const shortDuration = duration
      .replace("minutes", "m")
      .replace("hours", "h");
    result += ` · ${shortDuration}`;
  }

  // thêm repeat
  if (repeat && repeat !== "none") {
    const repeatLabels = {
      daily: "Every day",
      weekly: "Every week",
      weekday: "Every weekday",
      monthly: "Every month",
      yearly: "Every year",
    };
    result += ` · ${repeatLabels[repeat] || repeat}`;
  }

  return result;
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

const DateInput = ({
  selectedDate,
  selectedTime,
  selectedDuration,
  selectedRepeat, // ✅ thêm repeat
  onChange,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [previewDate, setPreviewDate] = useState(null);

  // ⏺ Đồng bộ props -> input
  useEffect(() => {
    setInputValue(
      formatFullDateTime(
        selectedDate,
        selectedTime,
        selectedDuration,
        selectedRepeat
      )
    );
    setNoResults(false);
    setPreviewDate(null);
  }, [selectedDate, selectedTime, selectedDuration, selectedRepeat]);

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

  const commitDate = (date) => {
    onChange({
      date,
      time: selectedTime,
      duration: selectedDuration,
      repeat: selectedRepeat,
    });
    setInputValue(
      formatFullDateTime(date, selectedTime, selectedDuration, selectedRepeat)
    );
    setNoResults(false);
    setPreviewDate(null);
    onClose();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && previewDate) {
      commitDate(previewDate);
    }
  };

  return (
    <>
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
        <div className="date-suggestion" onClick={() => commitDate(previewDate)}>
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
    </>
  );
};

export default DateInput;