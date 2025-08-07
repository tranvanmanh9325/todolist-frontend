import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { addDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0);
  const scrollContainerRef = useRef(null);
  const dayRefs = useRef([]);

  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const startDate = new Date(2025, 7, 4); // 4 Aug 2025

  // Đảm bảo định dạng ISO đúng theo local timezone
  const toLocalISODate = (date) => {
    const zonedDate = toZonedTime(date, 'UTC'); // Hoặc múi giờ khác nếu cần
    return format(zonedDate, 'yyyy-MM-dd');
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
      dates.push({
        date: format(date, 'd'), // Lấy ngày trong tháng (1-31)
        dayOfWeek,
        fullDate: date,
        dayName: fullDayNames[dayOfWeek],
        iso: toLocalISODate(date),
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
    const offset = 50;

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (dayElement) {
        const elementRect = dayElement.getBoundingClientRect();
        if (elementRect.top <= containerTop + offset && elementRect.bottom > containerTop + offset) {
          if (i !== currentTopDay) {
            setCurrentTopDay(i);
          }
          break;
        }
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopDay]);

  const startOfWeek = currentTopDay - (currentTopDay % 7);
  const weekDates = dates.slice(startOfWeek, startOfWeek + 7);

  return (
    <div className="calendar-container">
      <CalendarHeader
        weekDates={weekDates}
        currentTopDay={currentTopDay}
        dates={dates}
        dayRefs={dayRefs}
      />
      <CalendarContent
        dates={dates}
        dayRefs={dayRefs}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );
};

export default App;