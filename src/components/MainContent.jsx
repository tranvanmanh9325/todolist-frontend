import React, { useEffect, useState } from 'react';
import './MainContent.css';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import { useTaskForm } from '../contexts/TaskFormContext'; // ✅ lấy context

const MainContent = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { tasks, setTasks, submitTask } = useTaskForm(); // ✅ dùng từ context

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, [setTasks]);

  const handleToggleComplete = (taskId, newStatus) => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: newStatus,
        completedAt: newStatus ? new Date().toISOString() : null,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      })
      .catch((err) => console.error(err));
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
              <p className="task-count">{activeTasks.length} task</p>
              {activeTasks.map((task) => (
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
              ))}
            </div>
          )}

          {showForm ? (
            <TaskForm
              task={editTask}
              onCancel={() => {
                setShowForm(false);
                setEditTask(null);
              }}
              onSubmit={submitTask} // ✅ dùng hàm từ context
            />
          ) : (
            <button
              className="add-task-main"
              onClick={() => {
                setShowForm(true);
                setEditTask(null);
              }}
            >
              <span className="plus-icon">+</span> Add task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;