import './CalendarHeader.css';
import React from 'react';

const CalendarHeader = ({
  weekDates,
  selectedDayIndex,
  setSelectedDayIndex, // handleDayClick
  dates
}) => {
  return (
    <header className="calendar-header">
      <div className="calendar-header-inner">
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        <div className="month-selector">
          {/* ✅ Gộp chữ và icon chung 1 nhóm */}
          <div className="month-left">
            <span>August 2025</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button className="today-btn">Today</button>
        </div>

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