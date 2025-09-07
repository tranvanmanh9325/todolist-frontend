import React, { createContext, useState, useContext } from 'react';

const TaskFormContext = createContext();

// 🔹 Hàm tiện ích gọi API có kèm JWT
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { ...options, headers });

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

export const TaskFormProvider = ({ children }) => {
  // Form inline trong MainContent (route "/")
  const [showInlineForm, setShowInlineForm] = useState(false);

  // Form overlay khi click từ Sidebar (mọi route)
  const [showOverlayForm, setShowOverlayForm] = useState(false);

  // Danh sách task toàn cục (để chia sẻ)
  const [tasks, setTasks] = useState([]);

  // Mở/Tắt overlay form
  const openOverlayForm = () => setShowOverlayForm(true);
  const closeOverlayForm = () => setShowOverlayForm(false);

  // 🔹 Gửi task mới hoặc cập nhật task cũ
  const submitTask = async (task) => {
    const isEditing = Boolean(task.id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/tasks/${task.id}` : '/api/tasks';
    const body = isEditing
      ? JSON.stringify(task)
      : JSON.stringify({ ...task, completed: false });

    try {
      const data = await apiFetch(url, { method, body });

      setTasks((prev) =>
        isEditing
          ? prev.map((t) => (t.id === data.id ? data : t))
          : [...prev, data]
      );

      closeOverlayForm(); // ✅ đóng overlay sau khi submit
      setShowInlineForm(false); // ✅ đóng inline nếu dùng chung
    } catch (err) {
      console.error('❌ Lỗi khi gửi task:', err);
    }
  };

  return (
    <TaskFormContext.Provider
      value={{
        showInlineForm,
        setShowInlineForm,
        showOverlayForm,
        openOverlayForm,
        closeOverlayForm,
        tasks,
        setTasks,
        submitTask, // ✅ hàm mới để gửi task
      }}
    >
      {children}
    </TaskFormContext.Provider>
  );
};

// Hook để dùng trong các component
// eslint-disable-next-line react-refresh/only-export-components
export const useTaskForm = () => useContext(TaskFormContext);