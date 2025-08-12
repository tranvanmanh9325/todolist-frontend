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

  return (
    <AnimatePresence>
      {showOverlayForm && (
        <Motion.div
          key="overlay-content"
          className="overlay-content"
          initial={{ y: -8, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -8, scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <TaskForm
            task={editTask || null}
            onCancel={closeOverlayForm}
            onSubmit={handleSubmit}
          />
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskOverlay;