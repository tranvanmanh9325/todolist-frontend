import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { setHours, setMinutes, format } from 'date-fns'; 
import TaskOptions from './TaskOptions';
import './TaskForm.css';

const TaskForm = ({ onCancel, onSubmit, task }) => {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(''); 
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [isExiting, setIsExiting] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedRepeat, setSelectedRepeat] = useState(null);

  const [priority, setPriority] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState('');

  const [originalTask, setOriginalTask] = useState(null); // lưu dữ liệu gốc

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [reminderPos, setReminderPos] = useState({ top: 0, left: 0 });

  const typeRef = useRef();
  const dropdownRef = useRef(); 
  const dateButtonRef = useRef();
  const priorityButtonRef = useRef();
  const reminderButtonRef = useRef();
  const titleRef = useRef();

  // hàm format local datetime -> string yyyy-MM-dd'T'HH:mm:ss
  const fmt = (d) => format(d, "yyyy-MM-dd'T'HH:mm:ss");

  // Load dữ liệu khi edit
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setType(task.type || ''); 
      setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);

      let parsedTime = task.time ? new Date(task.time) : null;
      if (isNaN(parsedTime)) parsedTime = null;
      setSelectedTime(parsedTime);

      setSelectedDuration(task.duration || null);
      setSelectedRepeat(task.repeat || null);   
      setPriority(task.priority || null);
      setSelectedReminder(
        task.reminder !== null && task.reminder !== undefined
          ? String(task.reminder)
          : ''
      );

      // lưu bản gốc để so sánh khi update
      setOriginalTask({
        title: task.title || '',
        description: task.description || '',
        type: task.type || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        time: task.time || null,
        duration: task.duration || null,
        repeat: task.repeat || null,
        priority: task.priority || null,
        reminder: task.reminder !== null && task.reminder !== undefined ? String(task.reminder) : '',
      });
    }
  }, [task]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showTypeDropdown &&
        typeRef.current &&
        !typeRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTypeDropdown]);

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
      id: task?.id || null,
      title,
      description,
      type: type || null,
      dueDate: finalDate ? fmt(finalDate) : null, // dùng local format
      time:
        selectedTime instanceof Date && !isNaN(selectedTime)
          ? fmt(selectedTime) // dùng local format
          : null,
      duration: selectedDuration,
      repeat: selectedRepeat,
      priority: priority !== null ? priority : null,
      reminder: selectedReminder !== '' ? Number(selectedReminder) : null,
      completed: task?.completed || false,
    };

    onSubmit(taskData);

    if (isEdit) {
      // 👉 nếu update thì đóng form luôn
      onCancel();
    } else {
      // reset state khi add task mới
      setTitle('');
      setDescription('');
      setType('');
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedDuration(null);
      setSelectedRepeat(null);         
      setPriority(null);
      setSelectedReminder('');
    }
  };

  const handleCancelClick = () => {
    setIsExiting(true);
    setTimeout(() => onCancel(), 180);
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

  const isTitleEmpty = !title.trim();

  // kiểm tra có thay đổi so với bản gốc không
  const isChanged = () => {
    if (!originalTask) return true; // khi add task thì luôn true
    return (
      title !== originalTask.title ||
      description !== originalTask.description ||
      type !== originalTask.type ||
      (selectedDate ? selectedDate.toISOString() : null) !== originalTask.dueDate ||
      (selectedTime ? selectedTime.toISOString() : null) !== originalTask.time ||
      selectedDuration !== originalTask.duration ||
      selectedRepeat !== originalTask.repeat ||
      priority !== originalTask.priority ||
      selectedReminder !== originalTask.reminder
    );
  };

  return (
    <Motion.form
      className="task-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Title */}
      <div className="task-field">
        <textarea
          ref={titleRef}
          placeholder="Enter a task"
          className="task-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={1}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="task-field">
        <input
          type="text"
          placeholder="Description"
          className="task-note-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Task Options */}
      <TaskOptions
        dateButtonRef={dateButtonRef}
        priorityButtonRef={priorityButtonRef}
        reminderButtonRef={reminderButtonRef}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedDuration={selectedDuration}
        selectedRepeat={selectedRepeat}         
        priority={priority}
        selectedReminder={selectedReminder}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showPriorityPopup={showPriorityPopup}
        setShowPriorityPopup={setShowPriorityPopup}
        showReminderPopup={showReminderPopup}
        setShowReminderPopup={setShowReminderPopup}
        reminderPos={reminderPos}
        setReminderPos={setReminderPos}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setSelectedDuration={setSelectedDuration}
        setSelectedRepeat={setSelectedRepeat}   
        setPriority={setPriority}
        setSelectedReminder={setSelectedReminder}
      />

      {/* Task bottom */}
      <div className="task-bottom">
        <div className="task-type" ref={typeRef} onClick={toggleTypeDropdown}>
          📁 <span>{type || 'Type'}</span>
          <span className="dropdown-arrow">▾</span>
        </div>

        <div className="task-actions">
          <button type="button" className="cancel-btn" onClick={handleCancelClick}>
            Cancel
          </button>
          <button
            type="submit"
            className={`submit-btn${isTitleEmpty || (isEdit && !isChanged()) ? ' disabled' : ''}`}
            disabled={isTitleEmpty || (isEdit && !isChanged())}
          >
            {isEdit ? 'Update task' : 'Add task'}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showTypeDropdown && (
          <Motion.div
            ref={dropdownRef}
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