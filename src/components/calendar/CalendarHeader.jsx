import './CalendarHeader.css';
import React, { useState, useRef, useEffect } from 'react';
import { startOfMonth, endOfMonth, getDay, format } from 'date-fns';

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

  const generateMonthDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    let startOffset = getDay(start);
    if (startOffset === 0) startOffset = 7;

    const daysInMonth = [];
    for (let i = 1; i < startOffset; i++) daysInMonth.push(null);
    for (let d = 1; d <= end.getDate(); d++) daysInMonth.push(d);
    return daysInMonth;
  };

  const monthDays = generateMonthDays(currentMonth);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

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
              <div className="date-picker-popup">
                {/* Mũi tên popup */}
                <div className="popper__arrow"></div>

                <div className="date-picker-header">
                  <span className="date-picker-header-month">
                    {format(currentMonth, 'MMM yyyy')}
                  </span>

                  <div className="date-picker-header-actions">
                    <button
                      className="date-picker-header-action"
                      onClick={handlePrevMonth}
                    >
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

                    <button
                      className="date-picker-header-action outline-circle"
                      onClick={() => {
                        const isoToday = format(today, 'yyyy-MM-dd');
                        setSelectedDateInPopup(isoToday);
                        const idx = dates.findIndex(d => d.iso === isoToday);
                        if (idx !== -1) {
                          setSelectedDayIndex(idx);
                          setShowDatePicker(false);
                          setTimeout(() => scrollToDate(isoToday), 0);
                        } else {
                          setCurrentMonth(new Date());
                        }
                      }}
                      aria-label="Today"
                    />

                    <button
                      className="date-picker-header-action"
                      onClick={handleNextMonth}
                    >
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

                <div className="calendar-grid weekdays">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>{d}</div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {monthDays.map((day, idx) => {
                    if (!day) return <div key={idx}></div>;
                    const iso = format(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
                      'yyyy-MM-dd'
                    );
                    const isToday = iso === format(today, 'yyyy-MM-dd');
                    const isSelected = iso === selectedDateInPopup;
                    return (
                      <button
                        key={idx}
                        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDateInPopup(iso);
                          const index = dates.findIndex(d => d.iso === iso);
                          if (index !== -1) {
                            setSelectedDayIndex(index);
                            setShowDatePicker(false);
                            setTimeout(() => scrollToDate(iso), 0);
                          } else {
                            setShowDatePicker(false);
                          }
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
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