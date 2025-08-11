import './CalendarHeader.css';
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import DatePickerPopup from './DatePickerPopup';

const CalendarHeader = ({
  weekDates,
  selectedDayIndex,
  setSelectedDayIndex,
  dates,
  headerClassName = 'calendar-header',
  onTodayClick,
  onNextWeekClick,
  onPrevWeekClick
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const monthRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateInPopup, setSelectedDateInPopup] = useState(null);
  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedDayIndex != null && selectedDayIndex >= 0) {
      setSelectedDateInPopup(dates[selectedDayIndex]?.iso || null);
    }
  }, [selectedDayIndex, dates]);

  const scrollToDate = (iso) => {
    const target = document.querySelector(`.calendar-inner [data-iso="${iso}"]`);
    if (!target) return;
    const headerEl = document.querySelector('.calendar-header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <header className={headerClassName}>
      <div className="calendar-header-inner">
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        <div className="month-selector">
          <div
            className="month-left"
            ref={monthRef}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showDatePicker && (
              <DatePickerPopup
                currentMonth={currentMonth}
                today={today}
                selectedDateInPopup={selectedDateInPopup}
                setSelectedDateInPopup={setSelectedDateInPopup}
                dates={dates}
                setSelectedDayIndex={setSelectedDayIndex}
                setCurrentMonth={setCurrentMonth}
                setShowDatePicker={setShowDatePicker}
                scrollToDate={scrollToDate}
              />
            )}
          </div>

          <div className="week-nav-group">
            <button className="week-nav-btn" aria-label="Previous week" onClick={onPrevWeekClick}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="week-nav-today" onClick={onTodayClick}>
              Today
            </button>
            <button className="week-nav-btn" aria-label="Next week" onClick={onNextWeekClick}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="week-header" role="grid" tabIndex="-1">
          {weekDates.map((dayObj) => {
            const index = dates.findIndex(d => d.iso === dayObj.iso);
            const isSelected = index === selectedDayIndex;
            return (
              <a
                key={dayObj.iso}
                data-iso={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-selected={isSelected}
                className={`day-cell ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedDayIndex(index);
                  setSelectedDateInPopup(dayObj.iso);
                }}
                href="#"
              >
                <span className="day-wrapper">
                  <span className="day-name">{dayObj.dayName}</span>
                  <span className="day-number">{dayObj.date}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;