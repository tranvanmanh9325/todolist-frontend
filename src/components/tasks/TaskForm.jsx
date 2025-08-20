import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { format, setHours, setMinutes } from 'date-fns';
import SelectDatePopup from './SelectDatePopup';
import PriorityPopup from './clicks/PriorityPopup';
import ReminderPopup from './clicks/ReminderPopup'; // ✅ popup reminders
import { getDateColorClass } from '../../utils/dateColors';
import './TaskForm.css';

const TaskForm = ({ onCancel, onSubmit, task }) => {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('Type');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [isExiting, setIsExiting] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [priority, setPriority] = useState(null);
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);

  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [reminderPos, setReminderPos] = useState({ top: 0, left: 0 }); // ✅ vị trí popup

  const priorityButtonRef = useRef();
  const reminderButtonRef = useRef();
  const typeRef = useRef();
  const titleRef = useRef();
  const dateButtonRef = useRef();

  // ✅ map priority -> color
  const getPriorityColor = (level) => {
    switch (level) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'blue';
      case 4:
        return 'gray';
      default:
        return '#ccc';
    }
  };

  // Load dữ liệu khi edit
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNote(task.note || '');
      setType(task.project || 'Type');
      setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);

      let parsedTime = null;
      if (task.time) {
        parsedTime = task.time instanceof Date ? task.time : new Date(task.time);
        if (isNaN(parsedTime)) parsedTime = null;
      }
      setSelectedTime(parsedTime);
      setSelectedDuration(task.duration || null);
      setPriority(task.priority || null);
    }
  }, [task]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        typeRef.current &&
        !typeRef.current.contains(e.target) &&
        !e.target.closest('.project-dropdown')
      ) {
        setShowTypeDropdown(false);
      }
      if (
        reminderButtonRef.current &&
        !reminderButtonRef.current.contains(e.target) &&
        !e.target.closest('.reminder-popup')
      ) {
        setShowReminderPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalDate = selectedDate ? new Date(selectedDate) : null;
    if (finalDate && selectedTime instanceof Date && !isNaN(selectedTime)) {
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
      time:
        selectedTime instanceof Date && !isNaN(selectedTime)
          ? selectedTime.toISOString()
          : null,
      duration: selectedDuration,
      priority: priority,
    };

    onSubmit(taskData);

    setTitle('');
    setNote('');
    setType('Type');
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDuration(null);
    setPriority(null);
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

  const toggleTypeDropdown = () => {
    if (!showTypeDropdown && typeRef.current) {
      const rect = typeRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowTypeDropdown(!showTypeDropdown);
  };

  const toggleReminderPopup = () => {
    if (!showReminderPopup && reminderButtonRef.current) {
      const rect = reminderButtonRef.current.getBoundingClientRect();
      setReminderPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowReminderPopup(!showReminderPopup);
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const isTitleEmpty = !title.trim();

  const formatDate = (date) => {
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

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
        {/* Date */}
        <button
          type="button"
          className={`task-option ${selectedDate ? getDateColorClass(selectedDate) : ''}`}
          ref={dateButtonRef}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          📅 <span>{getDateTimeLabel()}</span>

          {selectedDate && (
            <span
              className="clear-date-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
                setSelectedTime(null);
                setSelectedDuration('none');
              }}
            >
              ✕
            </span>
          )}
        </button>

        {/* Priority */}
        <button
          type="button"
          className="task-option"
          ref={priorityButtonRef}
          onClick={() => setShowPriorityPopup(!showPriorityPopup)}
        >
          <span
            style={{ color: getPriorityColor(priority) }}
            className="priority-flag"
          >
            ⚑
          </span>
          <span>{priority ? `Priority ${priority}` : 'Priority'}</span>

          {priority && (
            <span
              className="clear-date-btn"
              onClick={(e) => {
                e.stopPropagation();
                setPriority(null);
              }}
            >
              ✕
            </span>
          )}
        </button>

        {/* Reminders */}
        <button
          type="button"
          className="task-option"
          ref={reminderButtonRef}
          onClick={toggleReminderPopup}
        >
          ⏰ <span>Reminders</span>
        </button>
      </div>

      {/* Popup chọn ngày */}
      {showDatePicker && (
        <SelectDatePopup
          anchorRef={dateButtonRef}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedDuration={selectedDuration}
          onChange={({ date, time, duration }) => {
            if (date !== undefined) setSelectedDate(date);
            if (date === null) {
              setSelectedTime(null);
              setSelectedDuration('none');
            }
            if (time !== undefined) setSelectedTime(time);
            if (duration !== undefined) setSelectedDuration(duration);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Popup chọn Priority */}
      {showPriorityPopup && (
        <PriorityPopup
          anchorRef={priorityButtonRef}
          selected={priority}
          onSelect={setPriority}
          onClose={() => setShowPriorityPopup(false)}
        />
      )}

      {/* Popup chọn Reminders */}
      <AnimatePresence>
        {showReminderPopup && (
          <Motion.div
            className="reminder-popup"
            style={{ top: reminderPos.top, left: reminderPos.left }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <ReminderPopup
              onClose={() => setShowReminderPopup(false)}
              onSave={() => setShowReminderPopup(false)}
            />
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Phần chọn loại và nút hành động */}
      <div className="task-bottom">
        <div className="task-type" ref={typeRef} onClick={toggleTypeDropdown}>
          📁 <span>{type}</span>
          <span className="dropdown-arrow">▾</span>
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

      {/* Dropdown dạng overlay */}
      <AnimatePresence>
        {showTypeDropdown && (
          <Motion.div
            className="project-dropdown"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
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
    </Motion.form>
  );
};

export default TaskForm;