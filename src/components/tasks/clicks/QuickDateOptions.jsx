import React from "react";
import "./QuickDateOptions.css";

const QuickDateOptions = ({ selectedDate, onChange, onClose }) => {
  const formatDateShort = (date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // chọn ngày (không toggle), bỏ chọn dùng nút No Date
  const handleSelect = (date) => {
    onChange(date);
    onClose();
  };

  // Các mốc ngày
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const getNextWeek = () => {
    const date = new Date();
    const day = date.getDay();
    let daysUntilNextMonday = (1 - day + 7) % 7;
    if (daysUntilNextMonday === 0) daysUntilNextMonday = 7; // luôn lấy thứ Hai tuần kế
    date.setDate(date.getDate() + daysUntilNextMonday);
    return date;
  };

  const getNextWeekend = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilNextSaturday = ((6 - day + 7) % 7) + 7; // luôn lấy T7 tuần kế
    date.setDate(date.getDate() + daysUntilNextSaturday);
    return date;
  };

  const nextWeekDate = getNextWeek();
  const nextWeekendDate = getNextWeekend();

  // Icon No Date
  const NoDateIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18m0 1a8 8 0 1 0 0 16 8 8 0 0 0 0-16m3.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0"
      ></path>
    </svg>
  );

  // 4 option cố định
  const baseOptions = [
    {
      key: "today",
      date: todayDate,
      label: "Today",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <g fill="currentColor" fillRule="evenodd">
            <path
              fillRule="nonzero"
              d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z"
            />
            <text fontSize="9" transform="translate(4 2)" fontWeight="500">
              <tspan x="8" y="15" textAnchor="middle">
                {todayDate.getDate()}
              </tspan>
            </text>
          </g>
        </svg>
      ),
      dateLabel: todayDate.toLocaleDateString("en-GB", { weekday: "short" }),
    },
    {
      key: "tomorrow",
      date: tomorrowDate,
      label: "Tomorrow",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653m5.932-14.32a.5.5 0 0 0-.654.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653M9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653m5.932 14.32a.5.5 0 0 1-.654-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653M7.5 12.001a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0M6.186 14.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924zM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924z"
            clipRule="evenodd"
          />
        </svg>
      ),
      dateLabel: tomorrowDate.toLocaleDateString("en-GB", { weekday: "short" }),
    },
    {
      key: "next-week",
      date: nextWeekDate,
      label: "Next week",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm8.354 4.647a.5.5 0 0 0-.708.707l1.647 1.647H8.5a.5.5 0 1 0 0 1h5.793l-1.647 1.646a.5.5 0 0 0 .708.707l2.5-2.5a.5.5 0 0 0 0-.707zM7 8a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      dateLabel: formatDateShort(nextWeekDate),
    },
    {
      key: "next-weekend",
      date: nextWeekendDate,
      label: "Next weekend",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path
            fill="currentColor"
            d="M16 6a3 3 0 0 1 3 3v1h.1c1 0 1.9 1 1.9 2v4c0 1-.8 2-1.9 2H18v.5a.5.5 0 0 1-1 0V18H7v.5a.5.5 0 0 1-1 0V18H5a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2V9a3 3 0 0 1 3-3zm3 5a1 1 0 0 0-1 .9V15H6v-3a1 1 0 0 0-2-.1V16c0 .5.4 1 .9 1H19a1 1 0 0 0 1-.9V12c0-.6-.4-1-1-1m-3-4H8c-1 0-2 .8-2 1.9v1.4c.6.3 1 1 1 1.7v2h10v-2a2 2 0 0 1 1-1.7V9c0-1-.8-2-1.9-2z"
          />
        </svg>
      ),
      dateLabel: formatDateShort(nextWeekendDate),
    },
  ];

  // Nếu đang có selectedDate -> thêm nút No Date ở cuối
  const options = selectedDate
    ? [
        ...baseOptions,
        {
          key: "no-date",
          date: null,
          label: "No Date",
          icon: NoDateIcon,
          dateLabel: "",
        },
      ]
    : baseOptions;

  return (
    <div className="quick-options">
      {options.map((opt) => {
        if (opt.key === "no-date") {
          return (
            <div
              key="no-date"
              className="no-date"
              onClick={() => {
                onChange(null);
                onClose();
              }}
            >
              <span className="left">
                <span className="icon">{opt.icon}</span>
                <span className="label">{opt.label}</span>
              </span>
            </div>
          );
        }

        const isSelected = isSameDay(selectedDate, opt.date);

        return (
          <div
            key={opt.key}
            className={`${opt.key} ${isSelected ? "selected" : ""}`}
            onClick={() => handleSelect(opt.date)}
          >
            <span className="left">
              <span className="icon">{opt.icon}</span>
              <span className="label">{opt.label}</span>
            </span>
            <span className="date">{opt.dateLabel}</span>
          </div>
        );
      })}
    </div>
  );
};

export default QuickDateOptions;