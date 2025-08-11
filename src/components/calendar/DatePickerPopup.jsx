import './DatePickerPopup.css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
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

  // Danh sách tháng: luôn 24 tháng liên tiếp kể từ currentMonth
  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(addMonths(currentMonth, i));
    }
    return arr;
  }, [currentMonth]);

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

  // Theo dõi tháng đang hiển thị khi cuộn
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
        setCurrentMonth(startOfMonth(now)); // dịch danh sách tháng
      }
    };
    const timer = setInterval(checkNewMonth, 1000 * 60 * 60); // mỗi giờ
    return () => clearInterval(timer);
  }, [currentToday, setCurrentMonth]);

  // Cuộn tới tháng cụ thể
  const scrollToMonth = (targetMonth) => {
    const container = scrollContainerRef.current;
    const monthIndex = monthsList.findIndex((m) => isSameMonth(m, targetMonth));
    const targetEl = container.querySelector(
      `[data-month-index="${monthIndex}"]`
    );
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Chuyển tháng
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    scrollToMonth(newMonth);
  };

  const handleTodayClick = () => {
    const isoToday = format(currentToday, 'yyyy-MM-dd');
    setSelectedDateInPopup(isoToday);
    const idx = dates.findIndex((d) => d.iso === isoToday);
    if (idx !== -1) {
      setSelectedDayIndex(idx);
      setShowDatePicker(false);
      setTimeout(() => scrollToDate(isoToday), 0);
    }
    setCurrentMonth(startOfMonth(currentToday));
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
            className="date-picker-header-action"
            onClick={handlePrevMonth}
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
            className="date-picker-header-action outline-circle"
            onClick={handleTodayClick}
            aria-label="Today"
          />
          <button
            className="date-picker-header-action"
            onClick={handleNextMonth}
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
      <div className="month-scroll-container" ref={scrollContainerRef}>
        {monthsList.map((month, mi) => {
          const monthDays = generateMonthDays(month);
          return (
            <div key={mi} className="month-block" data-month-index={mi}>
              <div className="month-title">{format(month, 'MMM yyyy')}</div>

              <div className="calendar-grid weekdays">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    {d}
                  </div>
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
                        setCurrentMonth(startOfMonth(dateObj)); // ✅ cập nhật tháng ở header
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