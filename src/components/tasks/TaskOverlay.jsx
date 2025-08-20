import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import TaskForm from './TaskForm';
import { useTaskForm } from '../../contexts/TaskFormContext';
import './TaskOverlay.css';

const TaskOverlay = () => {
  const {
    showOverlayForm,
    closeOverlayForm,
    submitTask,
    editTask,
  } = useTaskForm();

  const handleSubmit = (taskData) => {
    submitTask(taskData);
    closeOverlayForm();
  };

  const handleCancel = () => {
    closeOverlayForm();
  };

  return (
    <AnimatePresence>
      {showOverlayForm && (
        // ✅ Nền mờ bao phủ toàn màn hình
        <Motion.div
          className="overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeOverlayForm} // ✅ click ngoài thì đóng
        >
          <Motion.div
            key="overlay-content"
            className="overlay-content"
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()} // ✅ chặn click bên trong form
          >
            <TaskForm
              task={editTask || null}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskOverlay;