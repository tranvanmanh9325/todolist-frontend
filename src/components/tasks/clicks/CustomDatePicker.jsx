import './CustomDatePicker.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  format,
  startOfMonth,
  addMonths,
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
  const isNavigatingRef = useRef(false);

  const [visibleMonth, setVisibleMonth] = useState(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date())
  );
  const [today, setToday] = useState(new Date());
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  // monthsList dùng state
  const [monthsList, setMonthsList] = useState(() => {
    const startMonth = startOfMonth(new Date());
    return Array.from({ length: 24 }, (_, i) => addMonths(startMonth, i));
  });

  // cập nhật today mỗi giờ
  useEffect(() => {
    const t = setInterval(() => setToday(new Date()), 1000 * 60 * 60);
    return () => clearInterval(t);
  }, []);

  // ===== scrollToMonth đưa lên trước để tránh undefined =====
  const scrollToMonth = useCallback(
    (targetMonth, smooth = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const idx = monthsList.findIndex((m) => isSameMonth(m, targetMonth));
      if (idx < 0) return;

      const monthEl = container.querySelector(`[data-month-index="${idx}"]`);
      if (!monthEl) return;

      const divider = monthEl.querySelector('.calendar-grid.weekdays');
      let targetTop;
      if (divider) {
        targetTop = divider.offsetTop - container.offsetTop;
      } else {
        const title = monthEl.querySelector('.month-title');
        targetTop = monthEl.offsetTop + (title?.offsetHeight || 0) - container.offsetTop;
      }

      container.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
    },
    [monthsList]
  );

  // ✅ khi sang tháng mới, cập nhật monthsList và cuộn về tháng hiện tại
  useEffect(() => {
    const checkMonthChange = () => {
      const currentStart = startOfMonth(new Date());
      const firstMonth = monthsList[0];

      if (!isSameMonth(currentStart, firstMonth)) {
        setMonthsList((prev) => {
          const newList = [...prev.slice(1), addMonths(prev[prev.length - 1], 1)];
          return newList;
        });

        requestAnimationFrame(() => {
          setVisibleMonth(currentStart);
          scrollToMonth(currentStart, true);
        });
      }
    };

    const timer = setInterval(checkMonthChange, 1000 * 60 * 60); // mỗi giờ
    return () => clearInterval(timer);
  }, [monthsList, scrollToMonth]);

  const updateVisibleMonthFromTitles = useCallback(() => {
    if (isNavigatingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    let currentMonthIdx = 0;

    const titles = container.querySelectorAll('.month-title');
    titles.forEach((titleEl, idx) => {
      if (titleEl.getBoundingClientRect().top <= containerTop + 1) {
        currentMonthIdx = idx;
      }
    });

    const month = monthsList[currentMonthIdx];
    if (month && !isSameMonth(month, visibleMonth)) {
      setVisibleMonth(month);
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
        updateVisibleMonthFromTitles();
        ticking = false;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    updateVisibleMonthFromTitles();

    return () => container.removeEventListener('scroll', onScroll);
  }, [updateVisibleMonthFromTitles]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const targetMonth = isFirstOpen
      ? startOfMonth(new Date())
      : startOfMonth(selectedDate || new Date());

    setVisibleMonth(targetMonth);

    requestAnimationFrame(() => {
      scrollToMonth(targetMonth, false);
    });

    if (isFirstOpen) {
      setIsFirstOpen(false);
    }
  }, [selectedDate, scrollToMonth, isFirstOpen]);

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
    const currentIndex = monthsList.findIndex(m => isSameMonth(m, visibleMonth));
    if (currentIndex > 0) {
      const newM = monthsList[currentIndex - 1];
      isNavigatingRef.current = true;
      setVisibleMonth(newM);
      requestAnimationFrame(() => {
        scrollToMonth(newM, true);
        setTimeout(() => { isNavigatingRef.current = false; }, 500);
      });
    }
  };

  const handleNextMonth = () => {
    if (isAtLastMonth) return;
    const currentIndex = monthsList.findIndex(m => isSameMonth(m, visibleMonth));
    if (currentIndex < monthsList.length - 1) {
      const newM = monthsList[currentIndex + 1];
      isNavigatingRef.current = true;
      setVisibleMonth(newM);
      requestAnimationFrame(() => {
        scrollToMonth(newM, true);
        setTimeout(() => { isNavigatingRef.current = false; }, 500);
      });
    }
  };

  const handleTodayClick = () => {
    const monthStart = startOfMonth(new Date());
    isNavigatingRef.current = true;
    setVisibleMonth(monthStart);
    requestAnimationFrame(() => {
      scrollToMonth(monthStart, true);
      setTimeout(() => { isNavigatingRef.current = false; }, 500);
    });
  };

  return (
    <div className="custom-date-picker">
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