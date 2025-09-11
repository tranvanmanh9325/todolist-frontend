import React, { useState } from 'react';
import './MainContent.css';
import TaskForm from '../tasks/TaskForm';
import TaskItem from '../tasks/TaskItem';
import { useTaskForm } from '../../contexts/TaskFormContext'; // ✅ lấy context

// Lấy base API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Hàm tiện ích gọi API có kèm JWT
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: vui lòng đăng nhập lại');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return null;
};

const MainContent = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { tasks, setTasks, submitTask } = useTaskForm(); // ✅ dùng từ context

  // 🔹 Đánh dấu hoàn thành / bỏ hoàn thành
  const handleToggleComplete = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    apiFetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...task, // ✅ giữ nguyên title, description, type...
        completed: newStatus,
        completedAt: newStatus ? new Date().toISOString() : null,
      }),
    })
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      })
      .catch((err) => console.error('Lỗi khi cập nhật task:', err.message));
  };

  // 🔹 Xóa task
  const handleDeleteTask = (taskId) => {
    apiFetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      })
      .catch((err) => console.error('Lỗi khi xóa task:', err.message));
  };

  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="main-content">
      <header className="main-header">
        <h1>Today</h1>
      </header>

      {!showForm && activeTasks.length === 0 ? (
        <div className="welcome">
          <img src="/assets/sparkle.png" alt="Welcome" className="welcome-img" />
          <h2>Capture now, plan later</h2>
          <p>
            Inbox is your go-to spot for quick task entry. Clear your mind now,
            organize when you're ready.
          </p>
          <button
            className="add-task-centered"
            onClick={() => {
              setShowForm(true);
              setEditTask(null);
            }}
          >
            <span className="plus-icon">+</span> Add task
          </button>
        </div>
      ) : (
        <div className="content-area">
          {activeTasks.length > 0 && (
            <div className="task-list">
              <p className="task-count">
                {activeTasks.length} {activeTasks.length > 1 ? 'tasks' : 'task'}
              </p>

              {activeTasks.map((task) =>
                editTask && editTask.id === task.id && showForm ? (
                  <TaskForm
                    key={task.id}
                    task={task}
                    onCancel={() => {
                      setShowForm(false);
                      setEditTask(null);
                    }}
                    onSubmit={(updatedTask) => {
                      submitTask(updatedTask);
                      setShowForm(false);
                      setEditTask(null);
                    }}
                  />
                ) : (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={(t) => {
                      setEditTask(t);
                      setShowForm(true);
                    }}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                )
              )}
            </div>
          )}

          {showForm && !editTask ? (
            <TaskForm
              onCancel={() => {
                setShowForm(false);
                setEditTask(null);
              }}
              onSubmit={(newTask) => {
                submitTask(newTask);
                setShowForm(false);
              }}
            />
          ) : (
            !editTask && (
              <button
                className="add-task-main"
                onClick={() => {
                  setShowForm(true);
                  setEditTask(null);
                }}
              >
                <span className="plus-icon">+</span> Add task
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;