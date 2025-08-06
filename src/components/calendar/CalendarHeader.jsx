import './CalendarHeader.css';
import React from 'react';

const CalendarHeader = ({ daysOfWeek, currentTopDay }) => {
  return (
    <header className="calendar-header">
      <div className="header-top">
        <h1>Upcoming</h1>
      </div>

      <div className="month-selector">
        <span>August 2025</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <button className="today-btn">Today</button>
      </div>

      <div className="week-header">
        {daysOfWeek.map((day, index) => (
          <div key={day} className="day-header">
            <span className="day-name">{day}</span>
            <span className={`day-number ${index === 2 ? 'current-day' : ''}`}>
              {4 + index}
            </span>
            {index === currentTopDay && <div className="day-indicator"></div>}
          </div>
        ))}
      </div>
    </header>
  );
};

export default CalendarHeader;