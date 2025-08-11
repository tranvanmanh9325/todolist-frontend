import './DatePickerPopup.css';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfMonth,
  getDay,
  addMonths,
  subMonths,
  getDaysInMonth,
  isSameMonth,
} from 'date-fns';

const DatePickerPopup = ({
  currentMonth,
  today,
  selectedDateInPopup,
  setSelectedDateInPopup,
  dates,
  setSelectedDayIndex,
  setCurrentMonth,
  setShowDatePicker,
  scrollToDate,
}) => {
  const scrollContainerRef = useRef(null);
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [currentToday, setCurrentToday] = useState(today);

  // Danh sách tháng: từ tháng 8/2025 đến tháng 7/2027 (24 tháng)
  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(addMonths(startOfMonth(new Date(2025, 7, 1)), i));
    }
    return arr;
  }, []);

  // Cuộn popup tới tháng cụ thể (chỉ trong container)
  const scrollToMonth = useCallback((targetMonth) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const monthIndex = monthsList.findIndex((m) => isSameMonth(m, targetMonth));
    const targetEl = container.querySelector(
      `[data-month-index="${monthIndex}"]`
    );
    if (targetEl) {
      container.scrollTo({
        top: targetEl.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [monthsList]);

  // Tạo mảng ngày cho một tháng (42 ô)
  const generateMonthDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const daysInMonth = getDaysInMonth(monthDate);

    let startOffset = getDay(start);
    if (startOffset === 0) startOffset = 7;

    const daysArray = [];
    for (let i = 1; i < startOffset; i++) daysArray.push(null);
    for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);
    while (daysArray.length < 42) daysArray.push(null);

    return daysArray;
  };

  // Theo dõi tháng đang hiển thị khi cuộn trong popup
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const monthElements = container.querySelectorAll('.month-block');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry) {
          const monthIndex = parseInt(
            visibleEntry.target.getAttribute('data-month-index'),
            10
          );
          setVisibleMonth(monthsList[monthIndex]);
        }
      },
      { root: container, threshold: 0.6 }
    );

    monthElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [monthsList]);

  // Auto update khi sang tháng mới (theo hệ thống)
  useEffect(() => {
    const checkNewMonth = () => {
      const now = new Date();
      if (!isSameMonth(now, currentToday)) {
        setCurrentToday(now);
        setVisibleMonth(startOfMonth(now));
      }
    };
    const timer = setInterval(checkNewMonth, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, [currentToday]);

  // Khi selectedDateInPopup thay đổi -> đồng bộ popup hiển thị đúng tháng
  useEffect(() => {
    if (selectedDateInPopup) {
      const dateObj = new Date(selectedDateInPopup);
      setVisibleMonth(startOfMonth(dateObj));
      scrollToMonth(startOfMonth(dateObj));
    }
  }, [selectedDateInPopup, scrollToMonth]);

  // Xác định disable nút
  const firstAllowedMonth = startOfMonth(new Date(2025, 7, 1));
  const lastAllowedMonth = startOfMonth(new Date(2027, 6, 1));
  const isAtFirstMonth = isSameMonth(visibleMonth, firstAllowedMonth);
  const isAtLastMonth = isSameMonth(visibleMonth, lastAllowedMonth);

  // Chuyển tháng trong popup
  const handlePrevMonth = (e) => {
    if (isAtFirstMonth) return;
    e.stopPropagation();
    const newMonth = subMonths(visibleMonth, 1);
    setVisibleMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleNextMonth = (e) => {
    if (isAtLastMonth) return;
    e.stopPropagation();
    const newMonth = addMonths(visibleMonth, 1);
    setVisibleMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleTodayClick = () => {
    if (isAtFirstMonth) return;
    const isoToday = format(currentToday, 'yyyy-MM-dd');
    setSelectedDateInPopup(isoToday);
    const idx = dates.findIndex((d) => d.iso === isoToday);
    if (idx !== -1) {
      setSelectedDayIndex(idx);
      setCurrentMonth(startOfMonth(currentToday));
      setShowDatePicker(false);
      setTimeout(() => scrollToDate(isoToday), 0);
    }
    setVisibleMonth(startOfMonth(currentToday));
    scrollToMonth(currentToday);
  };

  return (
    <div className="date-picker-popup">
      <div className="popper__arrow"></div>

      {/* Header cố định */}
      <div className="date-picker-header sticky-header">
        <span className="date-picker-header-month">
          {format(visibleMonth, 'MMM yyyy')}
        </span>
        <div className="date-picker-header-actions">
          <button
            className={`date-picker-header-action ${isAtFirstMonth ? 'disabled' : ''}`}
            onClick={handlePrevMonth}
            disabled={isAtFirstMonth}
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
            className={`date-picker-header-action outline-circle ${isAtFirstMonth ? 'disabled' : ''}`}
            onClick={handleTodayClick}
            disabled={isAtFirstMonth}
            aria-label="Today"
          />
          <button
            className={`date-picker-header-action ${isAtLastMonth ? 'disabled' : ''}`}
            onClick={handleNextMonth}
            disabled={isAtLastMonth}
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

      {/* Nội dung cuộn */}
      <div
        className="month-scroll-container"
        ref={scrollContainerRef}
        style={{ overscrollBehavior: 'contain' }}
      >
        {monthsList.map((month, mi) => {
          const monthDays = generateMonthDays(month);
          return (
            <div key={mi} className="month-block" data-month-index={mi}>
              <div className="month-title">{format(month, 'MMM yyyy')}</div>

              <div className="calendar-grid weekdays">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>{d}</div>
                ))}
              </div>
              <div className="calendar-grid">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={idx}></div>;
                  const dateObj = new Date(month.getFullYear(), month.getMonth(), day);
                  const iso = format(dateObj, 'yyyy-MM-dd');
                  const isToday = iso === format(currentToday, 'yyyy-MM-dd');
                  const isSelected = iso === selectedDateInPopup;
                  return (
                    <button
                      key={idx}
                      className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDateInPopup(iso);
                        setCurrentMonth(startOfMonth(dateObj));
                        const index = dates.findIndex((d) => d.iso === iso);
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
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerPopup;