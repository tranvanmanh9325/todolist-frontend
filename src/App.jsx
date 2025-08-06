import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0); // index thực tế trong mảng dates
  const scrollContainerRef = useRef(null);
  const dayRefs = useRef([]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const generateDates = () => {
    const dates = [];
    const startDate = new Date(2025, 7, 4);
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date.getDate(),
        dayOfWeek: date.getDay() === 0 ? 6 : date.getDay() - 1,
        fullDate: date,
        dayName: fullDayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
    const offset = 50; // điều chỉnh độ trễ đổi ngày

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (dayElement) {
        const elementRect = dayElement.getBoundingClientRect();

        // Chỉ đổi khi phần tử này đã vượt qua điểm trên cùng + offset
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

  const currentWeekIndex = currentTopDay % 7; // tính vị trí trong tuần

  return (
    <div className="calendar-container">
      <CalendarHeader daysOfWeek={daysOfWeek} currentWeekIndex={currentWeekIndex} />
      <CalendarContent dates={dates} dayRefs={dayRefs} scrollContainerRef={scrollContainerRef} />
    </div>
  );
};

export default App;