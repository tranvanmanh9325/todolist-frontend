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
  const headerRef = useRef(null);

  const [visibleMonth, setVisibleMonth] = useState(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date())
  );
  const [today, setToday] = useState(new Date());
  const [headerHeight, setHeaderHeight] = useState(0);

  // baseMonth cố định theo thời điểm mở component (tránh rebuild monthsList khi today thay đổi)
  const baseMonthRef = useRef(startOfMonth(new Date()));

  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) arr.push(addMonths(baseMonthRef.current, i));
    return arr;
  }, []);

  // cập nhật chiều cao header (dùng khi cần bù offset)
  useEffect(() => {
    const updateHeader = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 0);
      }
    };
    updateHeader();
    window.addEventListener('resize', updateHeader);
    return () => window.removeEventListener('resize', updateHeader);
  }, []);

  // cập nhật "today" mỗi giờ (để highlight)
  useEffect(() => {
    const t = setInterval(() => setToday(new Date()), 1000 * 60 * 60);
    return () => clearInterval(t);
  }, []);

  // Scroll đến tháng cụ thể (bù headerHeight). smooth = true/false
  const scrollToMonth = useCallback(
    (targetMonth, smooth = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const idx = monthsList.findIndex((m) => isSameMonth(m, targetMonth));
      if (idx < 0) return;
      const el = container.querySelector(`[data-month-index="${idx}"]`);
      if (!el) return;

      const top = Math.max(0, el.offsetTop - headerHeight);
      container.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    },
    [monthsList, headerHeight]
  );

  // computeVisibleMonth: tính tháng có phần hiển thị lớn nhất trong container (đã trừ header)
  const computeVisibleMonth = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const viewTop = containerRect.top + headerHeight;
    const viewBottom = containerRect.bottom;

    const monthEls = container.querySelectorAll('.month-block');
    let bestIdx = -1;
    let bestVisible = -1;

    monthEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop);
      const vis = Math.max(0, visible);
      if (vis > bestVisible) {
        bestVisible = vis;
        bestIdx = Number(el.getAttribute('data-month-index')) || 0;
      }
    });

    if (bestIdx >= 0) {
      const month = monthsList[bestIdx];
      if (month && !isSameMonth(month, visibleMonth)) {
        setVisibleMonth(month);
      }
    }
  }, [monthsList, headerHeight, visibleMonth]);

  // scroll listener nhẹ (throttle bằng rAF) để cập nhật header khi user scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeVisibleMonth();
        ticking = false;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    computeVisibleMonth();

    return () => container.removeEventListener('scroll', onScroll);
  }, [computeVisibleMonth]);

  // Khi mở popup: cuộn ngay lập tức (không smooth) tới selectedDate hoặc today
  useEffect(() => {
    const targetMonth = startOfMonth(selectedDate || new Date());
    setVisibleMonth(targetMonth);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToMonth(targetMonth, false);
      });
    });
  }, [selectedDate, scrollToMonth]);

  // Weekdays
  const weekdays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
  });

  // Tạo ngày cho tháng
  const generateMonthDays = (monthDate) => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const end = endOfWeek(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), getDaysInMonth(monthDate)),
      { weekStartsOn: 1 }
    );
    const days = [];
    let cur = start;
    while (cur <= end) {
      days.push(cur);
      cur = addDays(cur, 1);
    }
    return days;
  };

  // Prev/Next/Today handlers
  const firstAllowedMonth = monthsList[0];
  const lastAllowedMonth = monthsList[monthsList.length - 1];
  const isAtFirstMonth = isSameMonth(visibleMonth, firstAllowedMonth);
  const isAtLastMonth = isSameMonth(visibleMonth, lastAllowedMonth);

  const handlePrevMonth = () => {
    if (isAtFirstMonth) return;
    const newM = subMonths(visibleMonth, 1);
    setVisibleMonth(newM);
    scrollToMonth(newM, true);
  };

  const handleNextMonth = () => {
    if (isAtLastMonth) return;
    const newM = addMonths(visibleMonth, 1);
    setVisibleMonth(newM);
    scrollToMonth(newM, true);
  };

  const handleTodayClick = () => {
    const monthStart = startOfMonth(new Date());
    setVisibleMonth(monthStart);
    scrollToMonth(monthStart, true);
  };

  return (
    <div className="custom-date-picker">
      <div
        className="month-scroll-container"
        ref={scrollContainerRef}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header sticky bên trong vùng cuộn */}
        <div className="date-picker-header sticky-header" ref={headerRef}>
          <span className="date-picker-header-month">{format(visibleMonth, 'MMM yyyy')}</span>
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
              className="date-picker-header-action outline-circle"
              onClick={handleTodayClick}
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

        {/* Danh sách tháng */}
        {monthsList.map((month, mi) => (
          <div key={mi} className="month-block" data-month-index={mi}>
            <div className="month-title">{format(month, 'MMM yyyy')}</div>

            <div className="calendar-grid weekdays">
              {weekdays.map((d, i) => (
                <div key={i} style={{ textAlign: 'center' }}>{format(d, 'EEEEE')}</div>
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
                      if (!isCurrentMonth) return;
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