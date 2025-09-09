import React, { createContext, useState, useContext } from 'react';

const TaskFormContext = createContext();

// 🔹 Lấy base API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Hàm tiện ích gọi API có kèm JWT
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // phòng khi backend có cookie
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token"); // 🔑 xóa token hỏng
      throw new Error("Unauthorized: vui lòng đăng nhập lại");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API error ${res.status}: ${errorText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    return null;
  } catch (err) {
    console.error("❌ Lỗi API:", err.message);
    throw err;
  }
};

export const TaskFormProvider = ({ children }) => {
  // Form inline trong MainContent (route "/")
  const [showInlineForm, setShowInlineForm] = useState(false);

  // Form overlay khi click từ Sidebar (mọi route)
  const [showOverlayForm, setShowOverlayForm] = useState(false);

  // Danh sách task toàn cục (chia sẻ giữa các component)
  const [tasks, setTasks] = useState([]);

  // Mở/Tắt overlay form
  const openOverlayForm = () => setShowOverlayForm(true);
  const closeOverlayForm = () => setShowOverlayForm(false);

  // 🔹 Submit task mới hoặc update task cũ
  const submitTask = async (task) => {
    const isEditing = Boolean(task.id);
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${API_URL}/tasks/${task.id}`
      : `${API_URL}/tasks`;

    const body = JSON.stringify({
      ...task,
      completed: isEditing ? task.completed : false,
    });

    try {
      const data = await apiFetch(url, { method, body });

      setTasks((prev) =>
        isEditing
          ? prev.map((t) => (t.id === data.id ? data : t))
          : [...prev, data]
      );

      // đóng form sau khi submit
      closeOverlayForm();
      setShowInlineForm(false);
    } catch (err) {
      console.error("❌ Lỗi khi gửi task:", err.message);
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
        submitTask,
      }}
    >
      {children}
    </TaskFormContext.Provider>
  );
};

// Hook để dùng trong component khác
// eslint-disable-next-line react-refresh/only-export-components
export const useTaskForm = () => useContext(TaskFormContext);