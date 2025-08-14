import './CustomDatePicker.css';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfMonth,
  addMonths,
  subMonths,
  getDaysInMonth,
  isSameMonth,
} from 'date-fns';

const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
  const scrollContainerRef = useRef(null);
  const [visibleMonth, setVisibleMonth] = useState(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date())
  );
  const [today, setToday] = useState(new Date());

  // Danh sách tháng: từ tháng hiện tại + 24 tháng
  const monthsList = useMemo(() => {
    const start = startOfMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(addMonths(start, i));
    }
    return arr;
  }, [today]);

  // Cuộn tới tháng cụ thể
  const scrollToMonth = useCallback(
    (targetMonth) => {
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
    },
    [monthsList]
  );

  // Tạo mảng ngày cho 1 tháng
  const generateMonthDays = (monthDate) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const daysArray = [];
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
    }
    return daysArray;
  };

  // Theo dõi tháng hiển thị khi cuộn
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

  // Auto cập nhật nếu qua ngày mới
  useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      if (!isSameMonth(now, today)) {
        setToday(now);
      }
    };
    const timer = setInterval(checkNewDay, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, [today]);

  // Khi mở lên, cuộn đến ngày đã chọn
  useEffect(() => {
    if (selectedDate) {
      const monthStart = startOfMonth(selectedDate);
      setVisibleMonth(monthStart);
      scrollToMonth(monthStart);
    }
  }, [selectedDate, scrollToMonth]);

  // Giới hạn tháng
  const firstAllowedMonth = monthsList[0];
  const lastAllowedMonth = monthsList[monthsList.length - 1];
  const isAtFirstMonth = isSameMonth(visibleMonth, firstAllowedMonth);
  const isAtLastMonth = isSameMonth(visibleMonth, lastAllowedMonth);

  const handlePrevMonth = () => {
    if (isAtFirstMonth) return;
    const newMonth = subMonths(visibleMonth, 1);
    setVisibleMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleNextMonth = () => {
    if (isAtLastMonth) return;
    const newMonth = addMonths(visibleMonth, 1);
    setVisibleMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleTodayClick = () => {
    const monthStart = startOfMonth(today);
    setVisibleMonth(monthStart);
    scrollToMonth(monthStart);
  };

  return (
    <div className="custom-date-picker">
      {/* Header */}
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
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
          <button
            className="date-picker-header-action outline-circle"
            onClick={handleTodayClick}
          >
            Today
          </button>
          <button
            className={`date-picker-header-action ${isAtLastMonth ? 'disabled' : ''}`}
            onClick={handleNextMonth}
            disabled={isAtLastMonth}
          >
            <svg viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div
        className="month-scroll-container"
        ref={scrollContainerRef}
        style={{ overscrollBehavior: 'contain' }}
      >
        {monthsList.map((month, mi) => (
          <div key={mi} className="month-block" data-month-index={mi}>
            <div className="month-title">{format(month, 'MMM yyyy')}</div>
            <div className="calendar-grid weekdays">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center' }}>{d}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {generateMonthDays(month).map((dayDate, idx) => {
                const iso = format(dayDate, 'yyyy-MM-dd');
                const isToday = iso === format(today, 'yyyy-MM-dd');
                const isSelected = selectedDate && iso === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <button
                    key={idx}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(dayDate);
                      onClose();
                    }}
                  >
                    {dayDate.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDatePicker;