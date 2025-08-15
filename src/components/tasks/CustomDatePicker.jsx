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

  const baseMonthRef = useRef(startOfMonth(new Date()));

  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) arr.push(addMonths(baseMonthRef.current, i));
    return arr;
  }, []);

  useEffect(() => {
    const t = setInterval(() => setToday(new Date()), 1000 * 60 * 60);
    return () => clearInterval(t);
  }, []);

  const scrollToMonth = useCallback(
    (targetMonth, smooth = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const idx = monthsList.findIndex((m) => isSameMonth(m, targetMonth));
      if (idx < 0) return;

      const el = container.querySelector(`[data-month-index="${idx}"]`);
      if (!el) return;

      const top = el.offsetTop;
      container.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    },
    [monthsList]
  );

  const computeVisibleMonth = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    const monthEls = container.querySelectorAll('.month-block');
    let bestIdx = -1;
    let bestVisible = -1;

    monthEls.forEach((el) => {
      const idx = Number(el.getAttribute('data-month-index')) || 0;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;

      const visible = Math.max(0, Math.min(elBottom, viewBottom) - Math.max(elTop, viewTop));

      if (visible > bestVisible || (visible === bestVisible && (bestIdx === -1 || idx < bestIdx))) {
        bestVisible = visible;
        bestIdx = idx;
      }
    });

    if (bestIdx >= 0) {
      const month = monthsList[bestIdx];
      if (month && !isSameMonth(month, visibleMonth)) {
        setVisibleMonth(month);
      }
    }
  }, [monthsList, visibleMonth]);

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

  useEffect(() => {
    const targetMonth = startOfMonth(selectedDate || new Date());
    setVisibleMonth(targetMonth);
    requestAnimationFrame(() => {
      scrollToMonth(targetMonth, false);
    });
  }, [selectedDate, scrollToMonth]);

  const weekdays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
  });

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
      {/* Header nằm ngoài vùng cuộn */}
      <div className="date-picker-header">
        <span className="date-picker-header-month">{format(visibleMonth, 'MMM yyyy')}</span>
        <div className="date-picker-header-actions">
          <button
            className={`date-picker-header-action ${isAtFirstMonth ? 'disabled' : ''}`}
            onClick={handlePrevMonth}
            disabled={isAtFirstMonth}
          >
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
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
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Vùng cuộn */}
      <div
        className="month-scroll-container"
        ref={scrollContainerRef}
        style={{ overscrollBehavior: 'contain', maxHeight: '300px', overflowY: 'auto' }}
      >
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