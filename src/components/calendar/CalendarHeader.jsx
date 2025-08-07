import './CalendarHeader.css';
import React from 'react';

const CalendarHeader = ({ weekDates, currentTopDay, dates, dayRefs }) => {
  const currentIso = dates[currentTopDay]?.iso;

  const handleClick = (iso) => {
    const index = dates.findIndex(d => d.iso === iso);
    if (index !== -1 && dayRefs.current[index]) {
      dayRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <header className="calendar-header">
      <div className="header-top">
        <h1>Upcoming</h1>
      </div>

      <div className="month-selector">
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
        <button className="today-btn">Today</button>
      </div>

      <div className="week-header" role="grid" tabIndex="-1">
        {weekDates.map((dayObj) => (
          <a
            key={dayObj.iso}
            role="gridcell"
            aria-label={dayObj.iso}
            aria-disabled="false"
            aria-selected={dayObj.iso === currentIso}
            className={`day-cell ${dayObj.iso === currentIso ? 'selected' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Ngăn chuyển hướng trang
              handleClick(dayObj.iso); // Scroll mượt đến section
            }}
            href={`#`} // Vẫn để href="#" để giữ cấu trúc HTML đúng
          >
            <span className="day-wrapper">
              <span className="day-name">{dayObj.dayName}</span>
              <span className="day-number">{dayObj.date}</span>
            </span>
          </a>
        ))}
      </div>
    </header>
  );
};

export default CalendarHeader;