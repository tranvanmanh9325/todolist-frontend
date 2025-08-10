import './CalendarHeader.css';
import React, { useState, useRef, useEffect } from 'react';

const CalendarHeader = ({
  weekDates,
  selectedDayIndex,
  setSelectedDayIndex,
  dates,
  headerClassName = 'calendar-header',
  onTodayClick,
  onNextWeekClick,
  onPrevWeekClick
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const monthRef = useRef(null);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={headerClassName}>
      <div className="calendar-header-inner">
        {/* Tiêu đề */}
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        {/* Khu vực tháng + nút điều hướng */}
        <div className="month-selector">
          {/* Tháng + icon dropdown */}
          <div
            className="month-left"
            ref={monthRef}
            style={{ position: 'relative' }}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span>August 2025</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showDatePicker && (
              <div className="date-picker-popup">
                {/* Phần header của popup */}
                <div className="date-picker-header">
                  <span className="date-picker-header-month">Aug 2025</span>
                  <div className="date-picker-header-actions">
                    <button
                      className="date-picker-header-action"
                      aria-label="Navigate to previous month"
                    >
                      ◀
                    </button>
                    <button
                      className="date-picker-header-action"
                      aria-label="Navigate to current month"
                    >
                      ●
                    </button>
                    <button
                      className="date-picker-header-action"
                      aria-label="Navigate to next month"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Phần body - bạn có thể render lưới ngày từ JS */}
                <div className="date-picker-monthlist">
                  <div className="calendar-grid">
                    {Array.from({ length: 30 }, (_, i) => (
                      <button key={i} className="calendar-day">
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Group nút điều hướng tuần */}
          <div className="week-nav-group">
            {/* Prev */}
            <button
              className="week-nav-btn"
              aria-label="Previous week"
              onClick={onPrevWeekClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14.354 8.354a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L10.707 12z" />
              </svg>
            </button>

            <div className="week-nav-separator"></div>

            {/* Today */}
            <button
              className="week-nav-today"
              onClick={onTodayClick}
            >
              Today
            </button>

            <div className="week-nav-separator"></div>

            {/* Next */}
            <button
              className="week-nav-btn"
              aria-label="Next week"
              onClick={onNextWeekClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9.646 8.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hiển thị các ngày trong tuần */}
        <div className="week-header" role="grid" tabIndex="-1">
          {weekDates.map((dayObj) => {
            const index = dates.findIndex(d => d.iso === dayObj.iso);
            const isSelected = index === selectedDayIndex;

            return (
              <a
                key={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-disabled="false"
                aria-selected={isSelected}
                className={`day-cell ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedDayIndex(index);
                }}
                href="#"
              >
                <span className="day-wrapper">
                  <span className="day-name">{dayObj.dayName}</span>
                  <span className="day-number">{dayObj.date}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;