import './DaySection.css';
import React from 'react';
import { format } from 'date-fns';

const DaySection = ({ dateInfo }) => {
  const month = format(dateInfo.fullDate, 'MMM');
  const isToday =
    dateInfo.date === new Date().getDate() &&
    format(dateInfo.fullDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  const isTomorrow =
    dateInfo.date === new Date().getDate() + 1 &&
    format(dateInfo.fullDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  return (
    <div className="day-section">
      <div className="day-title">
        <span className="date-number">{dateInfo.date}</span>
        {/* ✅ Bọc date-info trong wrapper để gạch bắt đầu sau số ngày */}
        <span className="date-info-wrapper">
          <span className="date-info">
            {month} ·{' '}
            {isToday
              ? 'Today · '
              : isTomorrow
              ? 'Tomorrow · '
              : ''}
            {dateInfo.dayName}
          </span>
        </span>
      </div>
      <button className="add-task-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3V13M3 8H13"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Add task</span>
      </button>
    </div>
  );
};

export default DaySection;