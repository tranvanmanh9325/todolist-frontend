import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(2);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (dayElement) {
        const elementTop = dayElement.getBoundingClientRect().top;
        const elementBottom = dayElement.getBoundingClientRect().bottom;
        if (elementTop <= containerTop + 100 && elementBottom > containerTop + 100) {
          const dayIndex = dates[i].dayOfWeek;
          if (dayIndex !== currentTopDay) {
            setCurrentTopDay(dayIndex);
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
  }, [currentTopDay, handleScroll]);

  return (
    <div className="calendar-container">
      <CalendarHeader daysOfWeek={daysOfWeek} currentTopDay={currentTopDay} />
      <CalendarContent dates={dates} dayRefs={dayRefs} scrollContainerRef={scrollContainerRef} />
    </div>
  );
};

export default App;