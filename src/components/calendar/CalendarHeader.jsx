import './CalendarHeader.css';
import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, isSameMonth } from 'date-fns';
import DatePickerPopup from './DatePickerPopup';

const CalendarHeader = ({
  weekDates,
  selectedDayIndex,
  setSelectedDayIndex,
  dates,
  currentMonth,
  setCurrentMonth,
  headerClassName = 'calendar-header',
  onTodayClick,
  onNextWeekClick,
  onPrevWeekClick,
  disablePrevWeek,
  disableNextWeek // ✅ Thêm prop mới
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const monthRef = useRef(null);
  const [selectedDateInPopup, setSelectedDateInPopup] = useState(null);
  const today = new Date();

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

  // Đồng bộ khi thay đổi ngày được chọn
  useEffect(() => {
    if (selectedDayIndex != null && selectedDayIndex >= 0 && dates[selectedDayIndex]) {
      setSelectedDateInPopup(dates[selectedDayIndex].iso || null);
      setCurrentMonth(startOfMonth(dates[selectedDayIndex].fullDate));
    }
  }, [selectedDayIndex, dates, setCurrentMonth]);

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
            {/* Nút lùi tuần */}
            <button
              className={`week-nav-btn ${disablePrevWeek ? 'disabled' : ''}`}
              aria-label="Previous week"
              onClick={() => {
                if (!disablePrevWeek) onPrevWeekClick();
              }}
              disabled={disablePrevWeek}
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

            {/* Nút Today */}
            <button className="week-nav-today" onClick={onTodayClick}>
              Today
            </button>

            {/* Nút tiến tuần */}
            <button
              className={`week-nav-btn ${disableNextWeek ? 'disabled' : ''}`}
              aria-label="Next week"
              onClick={() => {
                if (!disableNextWeek) onNextWeekClick();
              }}
              disabled={disableNextWeek}
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

        <div className="week-header" role="grid" tabIndex="-1">
          {weekDates.map((dayObj) => {
            const index = dates.findIndex(d => d.iso === dayObj.iso);
            const isSelected = index === selectedDayIndex;
            const isOtherMonth = !isSameMonth(dayObj.fullDate, currentMonth);

            return (
              <a
                key={dayObj.iso}
                data-iso={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-selected={isSelected}
                className={`day-cell ${isSelected ? 'selected' : ''} ${isOtherMonth ? 'other-month' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (isOtherMonth) return;
                  setSelectedDayIndex(index);
                  setSelectedDateInPopup(dayObj.iso);
                  setCurrentMonth(startOfMonth(dayObj.fullDate || new Date(dayObj.iso)));
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