import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { addDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0); // dùng để xác định tuần hiển thị
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // ngày được chọn để highlight
  const dayRefs = useRef([]);
  const isInitialMount = useRef(true);

  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const startDate = new Date(2025, 7, 4); // 4 Aug 2025

  // Chuyển về định dạng ISO theo múi giờ Việt Nam
  const toLocalISODate = (date) => {
    const zonedDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
    return format(zonedDate, 'yyyy-MM-dd');
  };

  // Tạo danh sách 30 ngày
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
      dates.push({
        date: format(date, 'd'),
        dayOfWeek,
        fullDate: date,
        dayName: fullDayNames[dayOfWeek],
        iso: toLocalISODate(date),
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Cuộn đến ngày hôm nay khi load lần đầu
  useEffect(() => {
    if (isInitialMount.current) {
      const todayIso = toLocalISODate(new Date());
      const todayIndex = dates.findIndex(d => d.iso === todayIso);
      if (todayIndex !== -1) {
        setCurrentTopDay(todayIndex);
        setSelectedDayIndex(todayIndex); // ✅ highlight ngày hôm nay
        if (dayRefs.current[todayIndex]) {
          const element = dayRefs.current[todayIndex];
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const header = document.querySelector('.calendar-header');
          const headerHeight = header?.offsetHeight || 0;
          const top = rect.top + scrollTop - headerHeight - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
      isInitialMount.current = false;
    }
  }, [dates]);

  // Xác định ngày đang hiển thị trên màn hình (dùng để cập nhật tuần)
  const handleScroll = useCallback(() => {
    const offset = 50;
    const containerTop = 0;

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (dayElement) {
        const rect = dayElement.getBoundingClientRect();
        if (rect.top <= containerTop + offset && rect.bottom > containerTop + offset) {
          if (i !== currentTopDay) {
            setCurrentTopDay(i);
          }
          break;
        }
      }
    }
  }, [currentTopDay]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const startOfWeek = currentTopDay - (currentTopDay % 7);
  const weekDates = dates.slice(startOfWeek, startOfWeek + 7);

  return (
    <>
      <CalendarHeader
        weekDates={weekDates}
        currentTopDay={currentTopDay}
        selectedDayIndex={selectedDayIndex} // ✅ dùng để highlight ngày chọn
        setSelectedDayIndex={setSelectedDayIndex} // ✅ để cập nhật khi click
        dates={dates}
        dayRefs={dayRefs}
      />
      <CalendarContent
        dates={dates}
        dayRefs={dayRefs}
        scrollContainerRef={null}
      />
    </>
  );
};

export default App;