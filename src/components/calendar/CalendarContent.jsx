import './CalendarContent.css';
import React from 'react';
import DaySection from './DaySection';
import { isSameMonth } from 'date-fns';

const CalendarContent = ({ dates, dayRefs, scrollContainerRef, currentMonth }) => {
  return (
    <div className="calendar-content" ref={scrollContainerRef}>
      <div className="calendar-inner">
        {dates.map((dateInfo) => {
          if (!isSameMonth(dateInfo.fullDate, currentMonth)) {
            return null; // ❌ Ẩn ngày không thuộc tháng hiện tại
          }
          return (
            <div
              key={dateInfo.iso}
              ref={(el) => {
                const realIndex = dates.findIndex(d => d.iso === dateInfo.iso);
                dayRefs.current[realIndex] = el;
              }}
              data-iso={dateInfo.iso}
            >
              <DaySection dateInfo={dateInfo} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarContent;