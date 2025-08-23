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
  selectedRepeat,            // ⬅️ thêm repeat
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
  setSelectedRepeat,         // ⬅️ thêm setter repeat
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
    if (selectedRepeat) {
      label += ` [${selectedRepeat}]`; // ⬅️ hiển thị repeat trên nút Date
    }
    return label;
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
          {selectedDate && (
            <span
              className="clear-date-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
                setSelectedTime(null);
                setSelectedDuration('none');
                setSelectedRepeat(null);    // ⬅️ reset repeat khi clear date
                setSelectedReminder("");    // ⬅️ reset reminder khi clear date
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
          selectedRepeat={selectedRepeat}              // ⬅️ truyền repeat vào popup
          onChange={({ date, time, duration, repeat }) => {
            if (date !== undefined) setSelectedDate(date);
            if (date === null) {
              setSelectedTime(null);
              setSelectedDuration('none');
              setSelectedRepeat(null);                 // ⬅️ reset repeat nếu clear date
              setSelectedReminder("");
            }
            if (time !== undefined) setSelectedTime(time);
            if (duration !== undefined) setSelectedDuration(duration);
            if (repeat !== undefined) setSelectedRepeat(repeat); // ⬅️ cập nhật repeat từ popup
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