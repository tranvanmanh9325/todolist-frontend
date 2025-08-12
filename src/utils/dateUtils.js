import { addDays, format, addMonths, startOfMonth, startOfWeek } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const fullDayNames = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const toLocalISODate = (date) => {
  const zonedDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
  return format(zonedDate, 'yyyy-MM-dd');
};

/**
 * Generate daily objects spanning `monthCount` months starting at `start` month.
 * - Ensures the list begins at the Monday of the first month (weekStartsOn:1)
 *   so header/week calculations can include trailing days from previous month.
 * - Adds `isCurrentMonth` flag for styling/interaction decisions.
 *
 * @param {Date} start - a date somewhere in the starting month (App passes startOfMonth(new Date()))
 * @param {number} monthCount - how many months to include (default 24)
 * @returns {Array} dates objects { date, dayOfWeek, fullDate, dayName, iso, isCurrentMonth }
 */
export const generateDatesByMonths = (start, monthCount = 24) => {
  const dates = [];
  const monthStart = startOfMonth(start);
  const endDate = addMonths(monthStart, monthCount);
  // start the list at the start of the week that contains the first day of the month
  const listStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start

  let current = listStart;

  while (current <= endDate) {
    const dayOfWeek = current.getDay() === 0 ? 6 : current.getDay() - 1;
    dates.push({
      date: format(current, 'd'),
      dayOfWeek,
      fullDate: current,
      dayName: fullDayNames[dayOfWeek],
      iso: toLocalISODate(current),
      isCurrentMonth: current.getMonth() === monthStart.getMonth(), // flag if in the "base" month
    });
    current = addDays(current, 1);
  }
  return dates;
};