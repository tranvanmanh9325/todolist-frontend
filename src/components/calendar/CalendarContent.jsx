import './CalendarContent.css'; // Import the CSS file for CalendarContent
// eslint-disable-next-line no-unused-vars
import React, { useRef } from 'react';
import DaySection from './DaySection';

const CalendarContent = ({ dates, dayRefs, scrollContainerRef }) => {
  return (
    <div className="calendar-content" ref={scrollContainerRef}>
      {dates.map((dateInfo, index) => (
        <div key={index} ref={el => dayRefs.current[index] = el}>
          <DaySection dateInfo={dateInfo} />
        </div>
      ))}
    </div>
  );
};

export default CalendarContent;