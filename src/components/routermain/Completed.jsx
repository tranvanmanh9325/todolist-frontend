import React from "react";
import "./Completed.css";
import { useTaskForm } from "../../contexts/TaskFormContext"; // ✅ dùng context

const Completed = () => {
  const { tasks } = useTaskForm(); // ✅ lấy tasks từ context

  // 🔹 lọc task đã hoàn thành
  const completed = tasks.filter((t) => t.completed && t.completedAt);

  // 🔹 nhóm task theo ngày hoàn thành
  const groupByDate = (list) => {
    return list.reduce((groups, task) => {
      const date = new Date(task.completedAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
      return groups;
    }, {});
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const grouped = groupByDate(completed);

  return (
    <div className="completed-section">
      <header>
        <h1>Completed</h1>
      </header>

      {completed.length === 0 ? (
        <div className="no-completed">
          <img src="/assets/sparkle.png" alt="No tasks" />
          <h2>No completed tasks yet</h2>
          <p>Your completed tasks will appear here once done.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, tasks]) => (
          <div key={date} className="completed-group">
            <h3>{date}</h3>
            {tasks.map((task) => (
              <div key={task.id} className="completed-task-row">
                <div className="completed-check-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="#4CAF50"
                      strokeWidth="2"
                    />
                    <path
                      d="M6 10.5L9 13L14 7"
                      stroke="#4CAF50"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="completed-task-info">
                  <p>
                    <strong>You</strong> completed a task:{" "}
                    <span className="task-title">{task.title}</span>
                  </p>
                  <span className="completed-meta">
                    {formatTime(task.completedAt)} · {task.type || "Inbox"} 📁
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Completed;