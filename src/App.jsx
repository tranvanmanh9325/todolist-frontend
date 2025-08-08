import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { addDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isLockedScroll, setIsLockedScroll] = useState(false); // khóa handleScroll khi click
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

  /**
   * handleScroll (mạnh mẽ):
   * - tìm nút '.add-task-btn' bên trong mỗi dayRefs[i]
   * - tính vị trí bottom của add-btn so với headerHeight
   * - ngày hiện tại = ngày đầu tiên có addBtn.bottom > headerHeight (tức vẫn còn nhìn thấy dưới header)
   * - nếu isLockedScroll === true thì không làm gì (trường hợp click + scrollTo)
   */
  const handleScroll = useCallback(() => {
    if (isLockedScroll) return;

    const header = document.querySelector('.calendar-header');
    const headerHeight = header?.offsetHeight || 0;

    for (let i = 0; i < dayRefs.current.length; i++) {
      const dayElement = dayRefs.current[i];
      if (!dayElement) continue;

      // tìm phần tử add-task bên trong dayElement (nếu có)
      const addBtn = dayElement.querySelector ? dayElement.querySelector('.add-task-btn') : null;
      const targetRect = addBtn ? addBtn.getBoundingClientRect() : dayElement.getBoundingClientRect();

      // Nếu bottom của nút Add task (hoặc bottom của dayElement nếu ko tìm thấy nút)
      // vẫn nằm dưới header => đây là ngày hiện tại đang hiển thị
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

      // Debounce để unlock khi scroll dừng: 120ms đủ mượt
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

  // Click chọn ngày (được truyền xuống CalendarHeader)
  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setIsLockedScroll(true); // khóa update từ handleScroll trong lúc scrollTo đang chạy

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