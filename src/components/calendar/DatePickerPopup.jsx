import './DatePickerPopup.css';
import React from 'react';
import { format, startOfMonth, endOfMonth, getDay } from 'date-fns';

const DatePickerPopup = ({
  currentMonth,
  today,
  selectedDateInPopup,
  setSelectedDateInPopup,
  dates,
  setSelectedDayIndex,
  setCurrentMonth,
  setShowDatePicker,
  scrollToDate
}) => {
  // Tạo mảng ngày của tháng hiện tại, có thêm null cho các ô trống đầu tháng
  const generateMonthDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    let startOffset = getDay(start);
    if (startOffset === 0) startOffset = 7; // Chủ nhật => 7

    const daysInMonth = [];
    for (let i = 1; i < startOffset; i++) daysInMonth.push(null);
    for (let d = 1; d <= end.getDate(); d++) daysInMonth.push(d);
    return daysInMonth;
  };

  const monthDays = generateMonthDays(currentMonth);

  // Chuyển tháng về trước
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Chuyển tháng về sau
  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Xử lý click vào Today trong popup
  const handleTodayClick = () => {
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
  };

  return (
    <div className="date-picker-popup">
      {/* Mũi tên popup */}
      <div className="popper__arrow"></div>

      {/* Header của popup */}
      <div className="date-picker-header">
        <span className="date-picker-header-month">
          {format(currentMonth, 'MMM yyyy')}
        </span>

        <div className="date-picker-header-actions">
          <button className="date-picker-header-action" onClick={handlePrevMonth}>
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

          <button className="date-picker-header-action" onClick={handleNextMonth}>
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

      {/* Hàng tiêu đề thứ */}
      <div className="calendar-grid weekdays">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center' }}>{d}</div>
        ))}
      </div>

      {/* Lưới các ngày */}
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
  );
};

export default DatePickerPopup;