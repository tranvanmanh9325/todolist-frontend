import { addDays, format, addMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const fullDayNames = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const toLocalISODate = (date) => {
  const zonedDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
  return format(zonedDate, 'yyyy-MM-dd');
};

export const generateDatesByMonths = (start, monthCount = 24) => {
  const dates = [];
  const endDate = addMonths(start, monthCount);
  let current = start;

  while (current <= endDate) {
    const dayOfWeek = current.getDay() === 0 ? 6 : current.getDay() - 1;
    dates.push({
      date: format(current, 'd'),
      dayOfWeek,
      fullDate: current,
      dayName: fullDayNames[dayOfWeek],
      iso: toLocalISODate(current),
    });
    current = addDays(current, 1);
  }
  return dates;
};