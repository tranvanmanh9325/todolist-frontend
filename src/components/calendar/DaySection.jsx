import './DaySection.css';
import React from 'react';

const DaySection = ({ dateInfo }) => {
  return (
    <div className="day-section">
      <div className="day-title">
        <span className="date-number">{dateInfo.date}</span>
        <span className="date-info">
          Aug · {dateInfo.date === 6 ? 'Today · ' : dateInfo.date === 7 ? 'Tomorrow · ' : ''}
          {dateInfo.dayName}
        </span>
      </div>
      <button className="add-task-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Add task</span>
      </button>
    </div>
  );
};

export default DaySection;