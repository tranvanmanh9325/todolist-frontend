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
  const today = new Date();

  // Đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sinh lưới ngày
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

  // Điều hướng tháng
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  const handleTodayMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date());
  };

  return (
    <header className={headerClassName}>
      <div className="calendar-header-inner">
        {/* Tiêu đề */}
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        {/* Chọn tháng + điều hướng */}
        <div className="month-selector">
          {/* Tháng + icon dropdown */}
          <div
            className="month-left"
            ref={monthRef}
            style={{ position: 'relative' }}
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
                {/* Header popup */}
                <div className="date-picker-header">
                  <span className="date-picker-header-month">
                    {format(currentMonth, 'MMM yyyy')}
                  </span>

                  <div
                    className="date-picker-header-actions"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {/* Nút prev */}
                    <button
                      className="date-picker-header-action"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        padding: 0
                      }}
                      onClick={handlePrevMonth}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
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

                    {/* Nút Today tròn */}
                    <button
                      className="date-picker-header-action outline-circle"
                      style={{
                        width: '8px',
                        height: '8px',
                        border: '1px solid gray',
                        borderRadius: '50%',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={handleTodayMonth}
                      aria-label="Today"
                    />

                    {/* Nút next */}
                    <button
                      className="date-picker-header-action"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        padding: 0
                      }}
                      onClick={handleNextMonth}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
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

                {/* Tên thứ */}
                <div className="calendar-grid weekdays">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>{d}</div>
                  ))}
                </div>

                {/* Lưới ngày */}
                <div className="calendar-grid">
                  {monthDays.map((day, idx) => {
                    const isToday =
                      day &&
                      currentMonth.getMonth() === today.getMonth() &&
                      currentMonth.getFullYear() === today.getFullYear() &&
                      day === today.getDate();
                    return day ? (
                      <button
                        key={idx}
                        className={`calendar-day ${isToday ? 'selected' : ''}`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div key={idx}></div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nút điều hướng tuần */}
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

        {/* Thanh ngày */}
        <div className="week-header" role="grid" tabIndex="-1">
          {weekDates.map((dayObj) => {
            const index = dates.findIndex(d => d.iso === dayObj.iso);
            const isSelected = index === selectedDayIndex;

            return (
              <a
                key={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-selected={isSelected}
                className={`day-cell ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedDayIndex(index);
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