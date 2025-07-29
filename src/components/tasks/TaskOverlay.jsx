import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from './TaskForm';
import { useTaskForm } from '../../contexts/TaskFormContext';
import './TaskOverlay.css'; // 👉 tạo file CSS riêng nếu cần

const TaskOverlay = () => {
  const {
    showOverlayForm,
    closeOverlayForm,
    submitTask, // ✅ dùng để gửi dữ liệu lên backend
  } = useTaskForm();

  return (
    <AnimatePresence>
      {showOverlayForm && (
        <motion.div
          className="overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeOverlayForm}
        >
          <motion.div
            className="overlay-content"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // Ngăn click vào form đóng overlay
          >
            <TaskForm
              onCancel={closeOverlayForm}
              onSubmit={submitTask} // ✅ thay thế closeOverlayForm để thực sự gửi task
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskOverlay;