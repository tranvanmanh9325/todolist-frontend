import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useTaskForm } from "../../contexts/TaskFormContext";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { openOverlayForm } = useTaskForm();

  // ✅ Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const fullName = storedUser?.name || "User";
  const userName = fullName.split(" ")[0]; // chỉ lấy tên đầu tiên
  const userAvatar = storedUser?.avatar || null;
  const userInitial = fullName.charAt(0).toUpperCase(); // lấy chữ cái đầu tiên của full name

  const toggleSidebar = () => setCollapsed(!collapsed);

  // ✅ Xử lý click avatar
  const handleAvatarClick = () => {
    if (collapsed) {
      setCollapsed(false);
      setTimeout(() => setShowMenu(true), 220);
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  // ✅ Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Log out
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowMenu(false);
    navigate("/login");
  };

  // ✅ Nav items
  const navItems = [
    {
      path: "/app/search",
      label: "Search",
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
      path: "/app/main",
      label: "Inbox",
      icon: (
        <>
          <rect
            x="2"
            y="3"
            width="12"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 7H10M6 10H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      path: "/app/today",
      label: "Today",
      icon: (
        <>
          <rect
            x="2"
            y="3"
            width="12"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 1V5M10 1V5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      path: "/app/upcoming",
      label: "Upcoming",
      icon: (
        <>
          <path
            d="M2 8L8 2L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 7V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ),
    },
    {
      path: "/app/overview",
      label: "Overview",
      icon: (
        <>
          <path
            d="M8 2V8L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </>
      ),
    },
    {
      path: "/app/completed",
      label: "Completed",
      icon: (
        <>
          <path
            d="M11 6L7 10L5 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </>
      ),
    },
  ];

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      animate={{ width: collapsed ? 72 : 280 }}
      initial={false}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <header className="sidebar-header">
        {/* User profile + popup */}
        <div className="user-profile" ref={menuRef}>
          <div
            className="avatar"
            data-username={fullName}
            onClick={handleAvatarClick}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" className="avatar-img" />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>
          {!collapsed && (
            <span className="username" onClick={handleAvatarClick}>
              {userName}
            </span>
          )}

          {/* Popup Log out */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                className="user-menu"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <button onClick={handleLogout}>Log out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle button */}
        <div className="header-actions">
          <button
            aria-controls="sidebar"
            aria-expanded={!collapsed}
            aria-label="Open/close sidebar"
            type="button"
            onClick={toggleSidebar}
            className="list-toggle-btn"
          >
            <div className="list-toggle-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2m-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Add Task */}
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

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon }) => (
          <motion.div
            key={path}
            className={`nav-item ${
              location.pathname === path ? "active" : ""
            }`}
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

      {/* Projects */}
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

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className={`footer-item ${
            location.pathname === "/app/help" ? "active" : ""
          }`}
          onClick={() => navigate("/app/help")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5V8M8 11H8.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {!collapsed && <span>Help & Contact</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;