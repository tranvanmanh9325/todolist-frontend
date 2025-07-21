import React, { createContext, useState, useContext } from 'react';

const TaskFormContext = createContext();

export const TaskFormProvider = ({ children }) => {
  // Form inline trong MainContent (route "/")
  const [showInlineForm, setShowInlineForm] = useState(false);

  // Form overlay khi click từ Sidebar (mọi route)
  const [showOverlayForm, setShowOverlayForm] = useState(false);

  const openOverlayForm = () => setShowOverlayForm(true);
  const closeOverlayForm = () => setShowOverlayForm(false);

  return (
    <TaskFormContext.Provider
      value={{
        showInlineForm,
        setShowInlineForm,
        showOverlayForm,
        openOverlayForm,
        closeOverlayForm,
      }}
    >
      {children}
    </TaskFormContext.Provider>
  );
};

// Hook để dùng trong các component
export const useTaskForm = () => useContext(TaskFormContext);