import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import { startOfMonth, differenceInMonths, startOfWeek as dfStartOfWeek, isBefore } from 'date-fns';
import { generateDatesByMonths, toLocalISODate } from './utils/dateUtils';

const App = () => {
  const [currentTopDay, setCurrentTopDay] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isLockedScroll, setIsLockedScroll] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const dayRefs = useRef([]);
  const isInitialMount = useRef(true);
  const scrollTimeout = useRef(null);

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
    const timer = setInterval(checkMonthChange, 60 * 1000);
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
        setCurrentMonth(startOfMonth(dates[todayIndex].fullDate));
        scrollToDay(todayIndex);
      }
      isInitialMount.current = false;
    }
  }, [dates]);

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
          setCurrentMonth(startOfMonth(dates[i].fullDate));
        }
        break;
      }
    }
  }, [selectedDayIndex, isLockedScroll, dates]);

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

  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setCurrentTopDay(index);
    setIsLockedScroll(true);
    setCurrentMonth(startOfMonth(dates[index].fullDate));
    scrollToDay(index);
  };

  const handleTodayClick = () => {
    const todayIso = toLocalISODate(new Date());
    const todayIndex = dates.findIndex(d => d.iso === todayIso);
    if (todayIndex !== -1) {
      handleDayClick(todayIndex);
    }
  };

  const handleNextWeekClick = () => {
    const nextWeekIndex = currentTopDay + 7;
    if (nextWeekIndex < dates.length) {
      handleDayClick(nextWeekIndex);
    }
  };

  const handlePrevWeekClick = () => {
    const prevWeekIndex = currentTopDay - 7;
    if (prevWeekIndex >= 0) {
      handleDayClick(prevWeekIndex);
    }
  };

  // Tuần hiện tại
  const startOfWeekDate = dfStartOfWeek(
    dates[currentTopDay]?.fullDate || new Date(),
    { weekStartsOn: 1 }
  );
  const startOfWeekIndex = dates.findIndex(
    d => d.iso === toLocalISODate(startOfWeekDate)
  );
  const weekDates = dates.slice(startOfWeekIndex, startOfWeekIndex + 7);

  // ✅ Disable prev nếu tuần hiện tại có ngày < ngày 1 của tháng hiện tại hệ thống
  const systemCurrentMonth = startOfMonth(new Date());
  const disablePrevWeek = weekDates.some(d =>
    isBefore(d.fullDate, systemCurrentMonth)
  );

  return (
    <>
      <CalendarHeader
        weekDates={weekDates}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={handleDayClick}
        dates={dates}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        headerClassName={`calendar-header${headerScrolled ? ' scrolled' : ''}`}
        onTodayClick={handleTodayClick}
        onNextWeekClick={handleNextWeekClick}
        onPrevWeekClick={handlePrevWeekClick}
        disablePrevWeek={disablePrevWeek}
      />
      <CalendarContent
        dates={dates}
        dayRefs={dayRefs}
        scrollContainerRef={null}
        currentMonth={currentMonth}
      />
    </>
  );
};

export default App;