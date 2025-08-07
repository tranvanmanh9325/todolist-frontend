import './CalendarHeader.css';
import React from 'react';

const CalendarHeader = ({
  weekDates,
  selectedDayIndex,
  setSelectedDayIndex,
  dates,
  dayRefs
}) => {
  const handleClick = (iso) => {
    const index = dates.findIndex(d => d.iso === iso);
    if (index !== -1 && dayRefs.current[index]) {
      const element = dayRefs.current[index];
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const header = document.querySelector('.calendar-header');
      const headerHeight = header?.offsetHeight || 0;
      const top = rect.top + scrollTop - headerHeight - 8;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });

      setSelectedDayIndex(index); // ✅ cập nhật ngày được highlight
    }
  };

  return (
    <header className="calendar-header">
      <div className="calendar-header-inner">
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
                  handleClick(dayObj.iso);
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