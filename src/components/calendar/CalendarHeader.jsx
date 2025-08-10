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

  // Dùng state cho tháng hiện tại trong popup
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tính lưới ngày trong tháng
  const generateMonthDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    // getDay() trả 0 cho Chủ nhật, 1 cho Thứ 2...
    let startOffset = getDay(start);
    if (startOffset === 0) startOffset = 7; // Chủ nhật thành 7 để M=1 ... S=7

    const daysInMonth = [];
    // Thêm các ô trống trước ngày 1
    for (let i = 1; i < startOffset; i++) {
      daysInMonth.push(null);
    }
    // Thêm các ngày trong tháng
    for (let d = 1; d <= end.getDate(); d++) {
      daysInMonth.push(d);
    }
    return daysInMonth;
  };

  const monthDays = generateMonthDays(currentMonth);

  // Ngày hôm nay
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  return (
    <header className={headerClassName}>
      <div className="calendar-header-inner">
        {/* Tiêu đề */}
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        {/* Khu vực tháng + nút điều hướng */}
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
                {/* Header của popup */}
                <div className="date-picker-header">
                  <span className="date-picker-header-month">
                    {format(currentMonth, 'MMM yyyy')}
                  </span>
                  <div className="date-picker-header-actions">
                    <button
                      className="date-picker-header-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMonth(
                          new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                        );
                      }}
                    >
                      ◀
                    </button>
                    <button
                      className="date-picker-header-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMonth(new Date());
                      }}
                    >
                      ●
                    </button>
                    <button
                      className="date-picker-header-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMonth(
                          new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                        );
                      }}
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Hàng tên thứ */}
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
                      currentMonth.getMonth() === todayMonth &&
                      currentMonth.getFullYear() === todayYear &&
                      day === todayDay;
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

          {/* Group nút điều hướng tuần */}
          <div className="week-nav-group">
            {/* Prev */}
            <button
              className="week-nav-btn"
              aria-label="Previous week"
              onClick={onPrevWeekClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14.354 8.354a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L10.707 12z" />
              </svg>
            </button>

            {/* Today */}
            <button
              className="week-nav-today"
              onClick={onTodayClick}
            >
              Today
            </button>

            {/* Next */}
            <button
              className="week-nav-btn"
              aria-label="Next week"
              onClick={onNextWeekClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9.646 8.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hiển thị các ngày trong tuần */}
        <div className="week-header" role="grid" tabIndex="-1">
          {weekDates.map((dayObj) => {
            const index = dates.findIndex(d => d.iso === dayObj.iso);
            const isSelected = index === selectedDayIndex;

            return (
              <a
                key={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-disabled="false"
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