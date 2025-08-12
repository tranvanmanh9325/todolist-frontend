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
  disableNextWeek
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const monthRef = useRef(null);
  const today = new Date();

  // Hiệu ứng chuyển tuần/ngày
  const [transitionDirection, setTransitionDirection] = useState(null);
  const prevFirstDayRef = useRef(null);
  const prevSelectedDayRef = useRef(selectedDayIndex);

  const [selectedDateInPopup, setSelectedDateInPopup] = useState(null);

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

  // Cập nhật tháng khi chọn ngày
  useEffect(() => {
    if (selectedDayIndex != null && selectedDayIndex >= 0 && dates[selectedDayIndex]) {
      const dateObj = dates[selectedDayIndex];
      setSelectedDateInPopup(dateObj.iso || null);
      setCurrentMonth(startOfMonth(dateObj.fullDate));
    }
  }, [selectedDayIndex, dates, setCurrentMonth]);

  // Xác định hướng khi đổi tuần
  useEffect(() => {
    const prevFirstDay = prevFirstDayRef.current;
    const currentFirstDay = weekDates[0]?.fullDate;
    if (prevFirstDay && currentFirstDay) {
      if (currentFirstDay > prevFirstDay) {
        setTransitionDirection('left');
      } else if (currentFirstDay < prevFirstDay) {
        setTransitionDirection('right');
      }
    }
    prevFirstDayRef.current = currentFirstDay;
  }, [weekDates]);

  // Reset hiệu ứng sau khi chạy xong
  useEffect(() => {
    if (!transitionDirection) return;
    const timeout = setTimeout(() => setTransitionDirection(null), 350); // đồng bộ với CSS
    return () => clearTimeout(timeout);
  }, [transitionDirection]);

  // Scroll tới ngày
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

  // Chọn ngày
  const handleDayClick = (index, dayObj) => {
    if (index > prevSelectedDayRef.current) {
      setTransitionDirection('left');
    } else if (index < prevSelectedDayRef.current) {
      setTransitionDirection('right');
    }
    prevSelectedDayRef.current = index;
    setSelectedDayIndex(index);
    setSelectedDateInPopup(dayObj.iso);
    setCurrentMonth(startOfMonth(dayObj.fullDate || new Date(dayObj.iso)));
  };

  return (
    <header
      className={`${headerClassName} ${transitionDirection ? `week-slide-${transitionDirection}` : ''}`}
    >
      <div className="calendar-header-inner">
        {/* Tiêu đề */}
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        {/* Chọn tháng + điều hướng tuần */}
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
            <button
              className={`week-nav-btn ${disablePrevWeek ? 'disabled' : ''}`}
              aria-label="Previous week"
              onClick={() => !disablePrevWeek && onPrevWeekClick()}
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

            <button className="week-nav-today" onClick={onTodayClick}>
              Today
            </button>

            <button
              className={`week-nav-btn ${disableNextWeek ? 'disabled' : ''}`}
              aria-label="Next week"
              onClick={() => !disableNextWeek && onNextWeekClick()}
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

        {/* Header ngày */}
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
                className={`day-cell ${isSelected ? 'selected fade-in' : ''} ${
                  isOtherMonth ? 'other-month' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isOtherMonth) handleDayClick(index, dayObj);
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