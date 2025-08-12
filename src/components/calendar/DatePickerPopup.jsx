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

  // Danh sách tháng: từ tháng 8/2025 đến tháng 7/2027
  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(addMonths(startOfMonth(new Date(2025, 7, 1)), i));
    }
    return arr;
  }, []);

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

  // Tạo mảng ngày (bao gồm cả ngày tháng trước/sau)
  const generateMonthDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const daysInMonth = getDaysInMonth(monthDate);
    let startOffset = getDay(start);
    if (startOffset === 0) startOffset = 7;

    const daysArray = [];
    // Ngày tháng trước
    const prevMonth = subMonths(monthDate, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = startOffset - 1; i > 0; i--) {
      daysArray.push({
        day: daysInPrevMonth - i + 1,
        dateObj: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i + 1),
        isOtherMonth: true,
      });
    }
    // Ngày tháng hiện tại
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push({
        day: d,
        dateObj: new Date(monthDate.getFullYear(), monthDate.getMonth(), d),
        isOtherMonth: false,
      });
    }
    // Ngày tháng sau
    let nextDay = 1;
    while (daysArray.length < 42) {
      const nextMonth = addMonths(monthDate, 1);
      daysArray.push({
        day: nextDay,
        dateObj: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay),
        isOtherMonth: true,
      });
      nextDay++;
    }

    return daysArray;
  };

  // Theo dõi tháng hiển thị
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

  // Auto update khi sang tháng mới
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

  // Đồng bộ khi chọn ngày
  useEffect(() => {
    if (selectedDateInPopup) {
      const dateObj = new Date(selectedDateInPopup);
      setVisibleMonth(startOfMonth(dateObj));
      scrollToMonth(startOfMonth(dateObj));
    }
  }, [selectedDateInPopup, scrollToMonth]);

  // Điều kiện disable nút prev/next
  const firstAllowedMonth = startOfMonth(new Date(2025, 7, 1));
  const lastAllowedMonth = startOfMonth(new Date(2027, 6, 1));
  const isAtFirstMonth = isSameMonth(visibleMonth, firstAllowedMonth);
  const isAtLastMonth = isSameMonth(visibleMonth, lastAllowedMonth);

  // Kiểm tra có đang ở hôm nay không
  const isOnToday = selectedDateInPopup === format(currentToday, 'yyyy-MM-dd');
  const disableTodayButton = isOnToday && isAtFirstMonth;

  // Chuyển tháng
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

  // Nút Today
  const handleTodayClick = () => {
    if (disableTodayButton) return;
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
    scrollToMonth(startOfMonth(currentToday));
  };

  return (
    <div className="date-picker-popup">
      <div className="popper__arrow"></div>

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
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
                {monthDays.map((item, idx) => {
                  const iso = format(item.dateObj, 'yyyy-MM-dd');
                  const isToday = iso === format(currentToday, 'yyyy-MM-dd');
                  const isSelected = iso === selectedDateInPopup;
                  return (
                    <button
                      key={idx}
                      className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${item.isOtherMonth ? 'disabled-day' : ''}`}
                      onClick={() => {
                        if (item.isOtherMonth) return;
                        setSelectedDateInPopup(iso);
                        setCurrentMonth(startOfMonth(item.dateObj));
                        const index = dates.findIndex((d) => d.iso === iso);
                        if (index !== -1) {
                          setSelectedDayIndex(index);
                          setShowDatePicker(false);
                          setTimeout(() => scrollToDate(iso), 0);
                        } else {
                          setShowDatePicker(false);
                        }
                      }}
                      disabled={item.isOtherMonth}
                    >
                      {item.day}
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