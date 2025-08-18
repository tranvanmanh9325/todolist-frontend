import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { format, setHours, setMinutes } from 'date-fns';
import SelectDatePopup from './SelectDatePopup';
import './TaskForm.css';

const TaskForm = ({ onCancel, onSubmit, task }) => {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('Type');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // State cho Date picker
  const [selectedDate, setSelectedDate] = useState(null); // Date object
  const [selectedTime, setSelectedTime] = useState(null); // Date object (giờ phút)
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const typeRef = useRef();
  const titleRef = useRef();
  const dateButtonRef = useRef();

  // Load dữ liệu khi edit
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNote(task.note || '');
      setType(task.project || 'Type');
      setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);

      // luôn convert time thành Date nếu có
      let parsedTime = null;
      if (task.time) {
        parsedTime = task.time instanceof Date ? task.time : new Date(task.time);
        if (isNaN(parsedTime)) parsedTime = null;
      }
      setSelectedTime(parsedTime);

      setSelectedDuration(task.duration || null);
    }
  }, [task]);

  // Đóng dropdown khi click ngoài
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

    let finalDate = selectedDate ? new Date(selectedDate) : null;

    // Nếu có time thì merge vào date
    if (finalDate && selectedTime instanceof Date) {
      finalDate = setHours(
        setMinutes(finalDate, selectedTime.getMinutes()),
        selectedTime.getHours()
      );
    }

    const taskData = {
      ...task,
      title,
      note,
      project: type,
      dueDate: finalDate ? finalDate.toISOString() : null,
      time: selectedTime ? selectedTime.toISOString() : null, // luôn lưu ISO
      duration: selectedDuration,
    };

    onSubmit(taskData);

    // Reset form
    setTitle('');
    setNote('');
    setType('Type');
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDuration(null);
  };

  const handleCancelClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 180);
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

  // ✅ Hàm format dd/mm/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // ✅ Hàm hiển thị ngày + giờ + duration
  const getDateTimeLabel = () => {
    if (!selectedDate) return 'Date';

    let label = formatDate(selectedDate);
    if (selectedTime instanceof Date && !isNaN(selectedTime)) {
      label += ` ${format(selectedTime, 'HH:mm')}`;
    }
    if (selectedDuration && selectedDuration !== 'none') {
      label += ` (${selectedDuration})`;
    }
    return label;
  };

  return (
    <Motion.form
      className="task-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Tiêu đề task */}
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

      {/* Mô tả */}
      <div className="task-field">
        <input
          type="text"
          placeholder="Description"
          className="task-note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Các nút tùy chọn */}
      <div className="task-options">
        <button
          type="button"
          className="task-option"
          ref={dateButtonRef}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          📅 <span>{getDateTimeLabel()}</span>
        </button>

        <button type="button" className="task-option">
          🚩 <span>Priority</span>
        </button>
        <button type="button" className="task-option">
          ⏰ <span>Reminders</span>
        </button>
      </div>

      {/* Popup chọn ngày */}
      {showDatePicker && (
        <SelectDatePopup
          anchorRef={dateButtonRef}
          selectedDate={selectedDate}
          onChange={({ date, time, duration }) => {
            if (date !== undefined) setSelectedDate(date);
            if (time !== undefined) setSelectedTime(time);
            if (duration !== undefined) setSelectedDuration(duration);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Phần chọn loại và nút hành động */}
      <div className="task-bottom">
        <div
          className="task-type"
          ref={typeRef}
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
        >
          📁 <span>{type}</span>
          <span className="dropdown-arrow">▾</span>

          <AnimatePresence>
            {showTypeDropdown && (
              <Motion.div
                className="project-dropdown"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {['Personal', 'Study', 'Work'].map((t) => (
                  <div
                    key={t}
                    className="project-dropdown-item"
                    onClick={() => handleTypeSelect(t)}
                  >
                    {t}
                  </div>
                ))}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`submit-btn${isTitleEmpty ? ' disabled' : ''}`}
            disabled={isTitleEmpty}
          >
            {isEdit ? 'Update task' : 'Add task'}
          </button>
        </div>
      </div>
    </Motion.form>
  );
};

export default TaskForm;