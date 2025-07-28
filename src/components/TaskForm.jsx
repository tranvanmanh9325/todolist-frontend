import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TaskForm.css';

const TaskForm = ({ onCancel, onSubmit, task }) => {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('Type');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const typeRef = useRef();
  const titleRef = useRef();

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNote(task.note || '');
      setType(task.project || 'Type');
    }
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      ...task,
      title,
      note,
      project: type,
    };

    onSubmit(taskData);
    setTitle('');
    setNote('');
    setType('Type');
  };

  const handleTypeSelect = (t) => {
    setType(t);
    setShowTypeDropdown(false);
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const isTitleEmpty = !title.trim();

  return (
    <motion.form
      className="task-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="task-field">
        <textarea
          ref={titleRef}
          placeholder="Enter a task"
          className="task-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onInput={handleTextareaInput}
          rows={1}
          autoFocus
        />
      </div>

      <div className="task-field">
        <input
          type="text"
          placeholder="Description"
          className="task-note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="task-options">
        <button type="button" className="task-option">📅 <span>Date</span></button>
        <button type="button" className="task-option">🚩 <span>Priority</span></button>
        <button type="button" className="task-option">⏰ <span>Reminders</span></button>
        <button type="button" className="task-option">⋯</button>
      </div>

      <div className="task-bottom">
        <div className="task-type" ref={typeRef} onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
          📁 <span>{type}</span>
          <span className="dropdown-arrow">▾</span>

          <AnimatePresence>
            {showTypeDropdown && (
              <motion.div
                className="project-dropdown"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {['Personal', 'Study', 'Work'].map((t) => (
                  <div key={t} className="project-dropdown-item" onClick={() => handleTypeSelect(t)}>
                    {t}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="task-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button
            type="submit"
            className={`submit-btn${isTitleEmpty ? ' disabled' : ''}`}
            disabled={isTitleEmpty}
          >
            {isEdit ? 'Update task' : 'Add task'}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default TaskForm;