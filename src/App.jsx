import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(2); // Wednesday is index 2
  const scrollContainerRef = useRef(null);
  const dayRefs = useRef([]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Generate dates starting from August 4, 2025 (Monday)
  const generateDates = () => {
    const dates = [];
    const startDate = new Date(2025, 7, 4); // August 4, 2025
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date.getDate(),
        dayOfWeek: date.getDay() === 0 ? 6 : date.getDay() - 1, // Convert Sunday=0 to Sunday=6
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

    // eslint-disable-next-line no-unused-vars
    const scrollTop = scrollContainerRef.current.scrollTop;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    // Find which day section is currently at the top
    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (dayElement) {
        const elementTop = dayElement.getBoundingClientRect().top;
        const elementBottom = dayElement.getBoundingClientRect().bottom;
        
        // Check if this element is at or near the top of the visible area
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
      <header className="calendar-header">
        <div className="header-top">
          <h1>Upcoming</h1>
          <button className="display-btn">
            <span>Display</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="month-selector">
          <span>August 2025</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <button className="today-btn">Today</button>
        </div>

        <div className="week-header">
          {daysOfWeek.map((day, index) => (
            <div key={day} className="day-header">
              <span className="day-name">{day}</span>
              <span className={`day-number ${index === 2 ? 'current-day' : ''}`}>
                {4 + index}
              </span>
              {index === currentTopDay && <div className="day-indicator"></div>}
            </div>
          ))}
        </div>
      </header>

      <div className="calendar-content" ref={scrollContainerRef}>
        {dates.map((dateInfo, index) => (
          <div 
            key={index}
            ref={el => dayRefs.current[index] = el}
            className="day-section"
          >
            <div className="day-title">
              <span className="date-number">{dateInfo.date}</span>
              <span className="date-info">Aug · {dateInfo.date === 6 ? 'Today · ' : dateInfo.date === 7 ? 'Tomorrow · ' : ''}{dateInfo.dayName}</span>
            </div>
            <button className="add-task-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Add task</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;