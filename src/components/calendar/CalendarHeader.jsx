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
  const [selectedDateInPopup, setSelectedDateInPopup] = useState(null); // lưu ngày chọn trong popup
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

  // Cập nhật selectedDateInPopup khi selectedDayIndex thay đổi từ bên ngoài
  useEffect(() => {
    if (selectedDayIndex != null && selectedDayIndex >= 0) {
      setSelectedDateInPopup(dates[selectedDayIndex]?.iso || null);
    }
  }, [selectedDayIndex, dates]);

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

  // Cuộn đến ngày trong lịch chính
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
        {/* Tiêu đề */}
        <div className="header-top">
          <h1>Upcoming</h1>
        </div>

        {/* Chọn tháng + điều hướng */}
        <div className="month-selector">
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
                    {/* Prev */}
                    <button
                      className="date-picker-header-action"
                      style={{ width: '24px', height: '24px', padding: 0 }}
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

                    {/* Today */}
                    <button
                      className="date-picker-header-action outline-circle"
                      style={{
                        width: '8px',
                        height: '8px',
                        border: '1px solid gray',
                        borderRadius: '50%',
                        padding: 0
                      }}
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

                    {/* Next */}
                    <button
                      className="date-picker-header-action"
                      style={{ width: '24px', height: '24px', padding: 0 }}
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
                data-iso={dayObj.iso}
                role="gridcell"
                aria-label={dayObj.iso}
                aria-selected={isSelected}
                className={`day-cell ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedDayIndex(index);
                  setSelectedDateInPopup(dayObj.iso); // đồng bộ highlight popup
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