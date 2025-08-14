import './CustomDatePicker.css';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfMonth,
  addMonths,
  subMonths,
  getDaysInMonth,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  eachDayOfInterval
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

  // Tiêu đề ngày: Monday → Sunday
  const weekdays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
  });

  // Tạo mảng ngày cho 1 tháng (bao gồm cả ngày ngoài tháng để đủ tuần)
  const generateMonthDays = (monthDate) => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const end = endOfWeek(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), getDaysInMonth(monthDate)),
      { weekStartsOn: 1 }
    );
    const daysArray = [];
    let current = start;
    while (current <= end) {
      daysArray.push(current);
      current = addDays(current, 1);
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

  // Kiểm tra nút Today
  const isOnToday = selectedDate && isSameDay(selectedDate, today);
  const disableTodayButton = isOnToday && isAtFirstMonth;

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
    if (disableTodayButton) return;
    const monthStart = startOfMonth(today);
    setVisibleMonth(monthStart);
    scrollToMonth(monthStart);
    onChange(today);
    onClose();
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
            className={`date-picker-header-action outline-circle ${disableTodayButton ? 'disabled' : ''}`}
            onClick={handleTodayClick}
            disabled={disableTodayButton}
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

      {/* Nội dung */}
      <div
        className="month-scroll-container"
        ref={scrollContainerRef}
        style={{ overscrollBehavior: 'contain' }}
      >
        {monthsList.map((month, mi) => (
          <div key={mi} className="month-block" data-month-index={mi}>
            <div className="month-title">{format(month, 'MMM yyyy')}</div>
            {/* Tiêu đề ngày: Monday → Sunday */}
            <div className="calendar-grid weekdays">
              {weekdays.map((day, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  {format(day, 'EEEEE')}
                </div>
              ))}
            </div>
            <div className="calendar-grid">
              {generateMonthDays(month).map((dayDate, idx) => {
                const isToday = isSameDay(dayDate, today);
                const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
                const isCurrentMonth = isSameMonth(dayDate, month);
                return (
                  <button
                    key={idx}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'outside' : ''}`}
                    onClick={() => {
                      if (!isCurrentMonth) return; // ngày ngoài tháng không click
                      onChange(dayDate);
                      onClose();
                    }}
                  >
                    {isCurrentMonth ? dayDate.getDate() : ''}
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