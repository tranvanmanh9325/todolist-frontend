import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { startOfMonth, differenceInMonths } from 'date-fns';
import { generateDatesByMonths, toLocalISODate } from './utils/dateUtils';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isLockedScroll, setIsLockedScroll] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const dayRefs = useRef([]);
  const isInitialMount = useRef(true);
  const scrollTimeout = useRef(null);

  // Ngày bắt đầu = ngày đầu tháng hiện tại
  const [startDate, setStartDate] = useState(() => startOfMonth(new Date()));
  const [dates, setDates] = useState(() => generateDatesByMonths(startDate, 24));

  // Tự động cập nhật khi sang tháng mới
  useEffect(() => {
    const checkMonthChange = () => {
      const now = startOfMonth(new Date());
      if (differenceInMonths(now, startDate) !== 0) {
        setStartDate(now);
        setDates(generateDatesByMonths(now, 24));
      }
    };
    const timer = setInterval(checkMonthChange, 60 * 1000); // check mỗi phút
    return () => clearInterval(timer);
  }, [startDate]);

  // Cuộn tới hôm nay khi load lần đầu
  useEffect(() => {
    if (isInitialMount.current) {
      const todayIso = toLocalISODate(new Date());
      const todayIndex = dates.findIndex(d => d.iso === todayIso);
      if (todayIndex !== -1) {
        setCurrentTopDay(todayIndex);
        setSelectedDayIndex(todayIndex);
        scrollToDay(todayIndex);
      }
      isInitialMount.current = false;
    }
  }, [dates]);

  // Cuộn tới 1 ngày bất kỳ
  const scrollToDay = (index) => {
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

  // Lắng nghe scroll
  useEffect(() => {
    const onScroll = () => {
      handleScroll();
      setHeaderScrolled(window.scrollY > 0);
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

  // Chọn ngày
  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setCurrentTopDay(index);
    setIsLockedScroll(true);
    scrollToDay(index);
  };

  // Chuyển nhanh về hôm nay
  const handleTodayClick = () => {
    const todayIso = toLocalISODate(new Date());
    const todayIndex = dates.findIndex(d => d.iso === todayIso);
    if (todayIndex !== -1) {
      handleDayClick(todayIndex);
    }
  };

  // Chuyển sang tuần sau
  const handleNextWeekClick = () => {
    const nextWeekIndex = currentTopDay + 7;
    if (nextWeekIndex < dates.length) {
      handleDayClick(nextWeekIndex);
    }
  };

  // Chuyển sang tuần trước
  const handlePrevWeekClick = () => {
    const prevWeekIndex = currentTopDay - 7;
    if (prevWeekIndex >= 0) {
      handleDayClick(prevWeekIndex);
    }
  };

  // Tính tuần hiện tại
  const startOfWeek = currentTopDay - (currentTopDay % 7);
  const weekDates = dates.slice(startOfWeek, startOfWeek + 7);

  return (
    <>
      <CalendarHeader
        weekDates={weekDates}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={handleDayClick}
        dates={dates}
        headerClassName={`calendar-header${headerScrolled ? ' scrolled' : ''}`}
        onTodayClick={handleTodayClick}
        onNextWeekClick={handleNextWeekClick}
        onPrevWeekClick={handlePrevWeekClick}
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