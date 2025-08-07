import './CalendarContent.css';
import React from 'react';
import DaySection from './DaySection';

const CalendarContent = ({ dates, dayRefs, scrollContainerRef }) => {
  return (
    <div className="calendar-content" ref={scrollContainerRef}>
      <div className="calendar-inner">
        {dates.map((dateInfo, index) => (
          <div key={index} ref={el => (dayRefs.current[index] = el)}>
            <DaySection dateInfo={dateInfo} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarContent;