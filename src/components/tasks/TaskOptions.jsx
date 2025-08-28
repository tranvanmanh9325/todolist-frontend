import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import SelectDatePopup from './SelectDatePopup';
import PriorityPopup from './clicks/PriorityPopup';
import ReminderPopup from './clicks/ReminderPopup';
import { getDateColorClass } from '../../utils/dateColors';
import './TaskOptions.css'; // ✅ import CSS riêng

const TaskOptions = ({
  dateButtonRef,
  priorityButtonRef,
  reminderButtonRef,
  selectedDate,
  selectedTime,
  selectedDuration,
  selectedRepeat,
  priority,
  selectedReminder,
  showDatePicker,
  setShowDatePicker,
  showPriorityPopup,
  setShowPriorityPopup,
  showReminderPopup,
  setShowReminderPopup,
  reminderPos,
  setReminderPos,
  setSelectedDate,
  setSelectedTime,
  setSelectedDuration,
  setSelectedRepeat,
  setPriority,
  setSelectedReminder,
}) => {

  const formatDate = (date) => {
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
  };

  const getDateTimeLabel = () => {
    if (!selectedDate) return 'Date';
    let label = formatDate(selectedDate);

    if (selectedTime instanceof Date && !isNaN(selectedTime)) {
      label += ` ${selectedTime.getHours().toString().padStart(2,'0')}:${selectedTime.getMinutes().toString().padStart(2,'0')}`;
    }
    if (selectedDuration && selectedDuration !== 'none') {
      label += ` (${selectedDuration})`;
    }
    return label; // ⬅️ không hiển thị chữ repeat nữa
  };

  const getPriorityColor = (level) => {
    switch(level){
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'blue';
      case 4: return 'gray';
      default: return '#ccc';
    }
  };

  const formatReminderLabel = (value) => {
    switch(value){
      case "0": return "At time of event";
      case "30": return "30 minutes before";
      case "60": return "1 hour before";
      case "120": return "2 hours before";
      default: return null;
    }
  };

  const toggleReminderPopup = () => {
    if (!showReminderPopup && reminderButtonRef.current) {
      const rect = reminderButtonRef.current.getBoundingClientRect();
      setReminderPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowReminderPopup(!showReminderPopup);
  };

  return (
    <>
      <div className="task-options">
        {/* Date */}
        <button
          type="button"
          className={`task-option ${selectedDate ? getDateColorClass(selectedDate) : ''}`}
          ref={dateButtonRef}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          📅 <span>{getDateTimeLabel()}</span>

          {/* Hiển thị icon Repeat nếu có repeat */}
          {selectedRepeat && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ marginLeft: 6 }}>
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M9.5 4H6a.5.5 0 0 1 0-1h3.5a3 3 0 0 1 3 3v1.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L11.5 7.793V6a2 2 0 0 0-2-2M7.354 9.354a.5.5 0 0 1-.708 0L5.5 8.207V10a2 2 0 0 0 2 2H11a.5.5 0 0 1 0 1H7.5a3 3 0 0 1-3-3V8.207L3.354 9.354a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708"
                clipRule="evenodd"
              />
            </svg>
          )}

          {selectedDate && (
            <span
              className="clear-date-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
                setSelectedTime(null);
                setSelectedDuration('none');
                setSelectedRepeat(null);
                setSelectedReminder("");
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
          <span style={{color:getPriorityColor(priority)}} className="priority-flag">⚑</span>
          <span>{priority ? `Priority ${priority}` : 'Priority'}</span>
          {priority && (
            <span
              className="clear-date-btn"
              onClick={(e)=>{ e.stopPropagation(); setPriority(null); }}
            >
              ✕
            </span>
          )}
        </button>

        {/* Reminder */}
        <button
          type="button"
          className="task-option"
          ref={reminderButtonRef}
          onClick={toggleReminderPopup}
        >
          ⏰ <span>{selectedReminder ? formatReminderLabel(selectedReminder) : "Reminders"}</span>
          {selectedReminder && (
            <span
              className="clear-date-btn"
              onClick={(e)=>{ e.stopPropagation(); setSelectedReminder(""); }}
            >
              ✕
            </span>
          )}
        </button>
      </div>

      {/* Popups */}
      {showDatePicker && (
        <SelectDatePopup
          anchorRef={dateButtonRef}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedDuration={selectedDuration}
          selectedRepeat={selectedRepeat}
          onChange={({ taskDetail }) => {
            if (taskDetail) {
              if ('dueDate' in taskDetail) setSelectedDate(taskDetail.dueDate);
              if ('time' in taskDetail) setSelectedTime(taskDetail.time);
              if ('duration' in taskDetail) setSelectedDuration(taskDetail.duration);
              if ('repeat' in taskDetail) setSelectedRepeat(taskDetail.repeat);

              // Nếu clear date → reset luôn reminder
              if (taskDetail.dueDate === null) {
                setSelectedReminder("");
              }
            }
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {showPriorityPopup && (
        <PriorityPopup
          anchorRef={priorityButtonRef}
          selected={priority}
          onSelect={setPriority}
          onClose={() => setShowPriorityPopup(false)}
        />
      )}

      <AnimatePresence>
        {showReminderPopup && (
          <Motion.div
            className="task-reminder-wrapper"
            style={{ top:reminderPos.top, left:reminderPos.left }}
            initial={{ opacity:0, y:6 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:6 }}
            transition={{ duration:0.2 }}
          >
            <ReminderPopup
              selectedReminder={selectedReminder}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSave={(reminder)=>setSelectedReminder(reminder)}
              onClose={()=>setShowReminderPopup(false)}
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskOptions;