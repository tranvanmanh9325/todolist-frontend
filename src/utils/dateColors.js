// Hàm trả về class màu theo ngày
export const getDateColorClass = (date) => {
  if (!date) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "date-today";       // màu Today
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "date-tomorrow";    // màu Tomorrow
  }
  if (date < today) {
    return "date-overdue";     // màu Overdue
  }
  return "date-upcoming";      // màu khác (Upcoming)
};