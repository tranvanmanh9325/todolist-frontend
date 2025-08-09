import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { addDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isLockedScroll, setIsLockedScroll] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false); // ✅ Thêm state cho hiệu ứng bóng

  const dayRefs = useRef([]);
  const isInitialMount = useRef(true);
  const scrollTimeout = useRef(null);

  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const startDate = new Date(2025, 7, 4); // 4 Aug 2025

  const toLocalISODate = (date) => {
    const zonedDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
    return format(zonedDate, 'yyyy-MM-dd');
  };

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
        setSelectedDayIndex(todayIndex);
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

  // Xác định ngày hiện tại khi cuộn
  const handleScroll = useCallback(() => {
    if (isLockedScroll) return;

    const header = document.querySelector('.calendar-header');
    const headerHeight = header?.offsetHeight || 0;

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (!dayElement) continue;

      const addBtn = dayElement.querySelector
        ? dayElement.querySelector('.add-task-btn')
        : null;
      const targetRect = addBtn
        ? addBtn.getBoundingClientRect()
        : dayElement.getBoundingClientRect();

      if (targetRect.bottom > headerHeight + 4) {
        if (i !== selectedDayIndex) {
          setCurrentTopDay(i);
          setSelectedDayIndex(i);
        }
        break;
      }
    }
  }, [selectedDayIndex, isLockedScroll]);

  useEffect(() => {
    const onScroll = () => {
      handleScroll();

      // ✅ Toggle hiệu ứng bóng cho header
      if (window.scrollY > 0) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsLockedScroll(false);
      }, 120);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  // Click chọn ngày
  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setIsLockedScroll(true);

    if (dayRefs.current[index]) {
      const element = dayRefs.current[index];
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector('.calendar-header');
      const headerHeight = header?.offsetHeight || 0;
      const top = rect.top + scrollTop - headerHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const startOfWeek = currentTopDay - (currentTopDay % 7);
  const weekDates = dates.slice(startOfWeek, startOfWeek + 7);

  return (
    <>
      <CalendarHeader
        weekDates={weekDates}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={handleDayClick}
        dates={dates}
        headerClassName={`calendar-header${headerScrolled ? ' scrolled' : ''}`} // ✅ Thêm class
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