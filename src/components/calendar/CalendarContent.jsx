import './CalendarContent.css';
import React, { useState, useEffect } from 'react';
import DaySection from './DaySection';
import { startOfMonth } from 'date-fns';

const CalendarContent = ({ dates, dayRefs, scrollContainerRef }) => {
  const [minDate, setMinDate] = useState(startOfMonth(new Date()));
  const [maxDate, setMaxDate] = useState(
    new Date(minDate.getFullYear() + 2, minDate.getMonth(), 0)
  );

  // Theo dõi nếu sang tháng mới thì cập nhật lại min/max
  useEffect(() => {
    const checkMonthChange = () => {
      const now = startOfMonth(new Date());
      if (now.getTime() !== minDate.getTime()) {
        setMinDate(now);
        setMaxDate(new Date(now.getFullYear() + 2, now.getMonth(), 0));
      }
    };

    const timer = setInterval(checkMonthChange, 60 * 1000); // check mỗi phút
    return () => clearInterval(timer);
  }, [minDate]);

  return (
    <div className="calendar-content" ref={scrollContainerRef}>
      <div className="calendar-inner">
        {dates.map((dateInfo) => {
          if (dateInfo.fullDate < minDate || dateInfo.fullDate > maxDate) {
            return null; // Ẩn ngoài khoảng cho phép
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