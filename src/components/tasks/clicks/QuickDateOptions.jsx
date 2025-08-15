import React from "react";
import "./QuickDateOptions.css";

const QuickDateOptions = ({ onChange, onClose }) => {
  // Hàm chọn nhanh cộng thêm số ngày
  const quickSelect = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    handleSelect(date);
  };

  // Lấy ngày thứ 7 tuần này
  const getThisWeekend = () => {
    const date = new Date();
    const day = date.getDay(); // 0 = Chủ nhật, 6 = Thứ bảy
    const daysUntilSaturday = (6 - day + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    return date;
  };

  // Lấy thứ 2 tuần sau
  const getNextWeek = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilNextMonday = ((1 - day + 7) % 7) + 7;
    date.setDate(date.getDate() + daysUntilNextMonday);
    return date;
  };

  // Hàm xử lý chọn và đóng popup
  const handleSelect = (date) => {
    onChange(date);
    onClose();
  };

  return (
    <div className="quick-options">
      {/* Today */}
      <div className="today" onClick={() => quickSelect(0)}>
        <span className="icon">
          {/* SVG Today */}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <g fill="currentColor" fillRule="evenodd">
              <path
                fillRule="nonzero"
                d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z"
              />
              <text fontSize="9" transform="translate(4 2)" fontWeight="500">
                <tspan x="8" y="15" textAnchor="middle">
                  {new Date().getDate()}
                </tspan>
              </text>
            </g>
          </svg>
        </span>
        <span className="label">Today</span>
      </div>

      {/* Tomorrow */}
      <div className="tomorrow" onClick={() => quickSelect(1)}>
        <span className="icon">
          {/* SVG Tomorrow */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653m5.932-14.32a.5.5 0 0 0-.654.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653M9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653m5.932 14.32a.5.5 0 0 1-.654-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653M7.5 12.001a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0M6.186 14.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924zM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="label">Tomorrow</span>
      </div>

      {/* This Weekend */}
      <div className="this-weekend" onClick={() => handleSelect(getThisWeekend())}>
        <span className="icon">
          {/* SVG Weekend */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              fill="currentColor"
              d="M16 6a3 3 0 0 1 3 3v1h.1c1 0 1.9 1 1.9 2v4c0 1-.8 2-1.9 2H18v.5a.5.5 0 0 1-1 0V18H7v.5a.5.5 0 0 1-1 0V18H5a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2V9a3 3 0 0 1 3-3zm3 5a1 1 0 0 0-1 .9V15H6v-3a1 1 0 0 0-2-.1V16c0 .5.4 1 .9 1H19a1 1 0 0 0 1-.9V12c0-.6-.4-1-1-1m-3-4H8c-1 0-2 .8-2 1.9v1.4c.6.3 1 1 1 1.7v2h10v-2a2 2 0 0 1 1-1.7V9c0-1-.8-2-1.9-2z"
            />
          </svg>
        </span>
        <span className="label">This weekend</span>
      </div>

      {/* Next Week */}
      <div className="next-week" onClick={() => handleSelect(getNextWeek())}>
        <span className="icon">
          {/* SVG Next Week */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm8.354 4.647a.5.5 0 0 0-.708.707l1.647 1.647H8.5a.5.5 0 1 0 0 1h5.793l-1.647 1.646a.5.5 0 0 0 .708.707l2.5-2.5a.5.5 0 0 0 0-.707zM7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="label">Next week</span>
      </div>
    </div>
  );
};

export default QuickDateOptions;