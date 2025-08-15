import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskForm } from '../../contexts/TaskFormContext';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openOverlayForm } = useTaskForm();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      path: '/search',
      label: 'Search',
      icon: (
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M16.29 15.584a7 7 0 1 0-.707.707l3.563 3.563a.5.5 0 0 0 .708-.707zM11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12"
          clipRule="evenodd"
        />
      ),
    },
    {
      path: '/',
      label: 'Inbox',
      icon: (
        <>
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 7H10M6 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ),
    },
    {
      path: '/today',
      label: 'Today',
      icon: (
        <>
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 1V5M10 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ),
    },
    {
      path: '/upcoming',
      label: 'Upcoming',
      icon: (
        <>
          <path d="M2 8L8 2L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 7V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
    {
      path: '/overview',
      label: 'Overview',
      icon: (
        <>
          <path d="M8 2V8L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        </>
      ),
    },
    {
      path: '/completed',
      label: 'Completed',
      icon: (
        <>
          <path d="M11 6L7 10L5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        </>
      ),
    },
  ];

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 280 }}
      initial={false}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <header className="sidebar-header">
        <div className="user-profile">
          <div className="avatar">
            <span>M</span>
          </div>
        </div>

        <div className="header-actions">
          {/* Đã xoá hai nút SVG dưới avatar */}
          <button
            aria-controls="sidebar"
            aria-expanded={!collapsed}
            aria-label="Open/close sidebar"
            type="button"
            onClick={toggleSidebar}
            className={`list-toggle-btn ${collapsed ? '' : 'align-right'}`}
          >
            <div className="list-toggle-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2m-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {!collapsed && (
          <motion.button
            className="add-task-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={openOverlayForm}
          >
            <div className="add-icon">+</div>
            <span>Add task</span>
          </motion.button>
        )}
      </AnimatePresence>

      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon }) => (
          <motion.div
            key={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: collapsed ? 0 : 0.05 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              {icon}
            </svg>
            {!collapsed && <span>{label}</span>}
          </motion.div>
        ))}
      </nav>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="projects-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3>My Projects</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sidebar-footer">
        <div
          className={`footer-item ${location.pathname === '/help' ? 'active' : ''}`}
          onClick={() => navigate('/help')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5V8M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {!collapsed && <span>Help & Contact</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;