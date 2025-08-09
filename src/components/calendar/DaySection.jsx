import './DaySection.css';
import React from 'react';
import { format, addDays } from 'date-fns';

const DaySection = ({ dateInfo }) => {
  const month = format(dateInfo.fullDate, 'MMM');

  const todayISO = format(new Date(), 'yyyy-MM-dd');
  const tomorrowISO = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const currentISO = format(dateInfo.fullDate, 'yyyy-MM-dd');

  const isToday = currentISO === todayISO;
  const isTomorrow = currentISO === tomorrowISO;

  return (
    <div className="day-section">
      <div className="day-title">
        <span className="date-number">{dateInfo.date}</span>
        <span className="date-info-wrapper">
          <span className="date-info">
            <span className="month">{month}</span>
            {isToday && <span className="today-label"> · Today</span>}
            {isTomorrow && <span className="tomorrow-label"> · Tomorrow</span>}
            {' · '}
            <span className="day-name">{dateInfo.dayName}</span>
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