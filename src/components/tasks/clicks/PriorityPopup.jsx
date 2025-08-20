// ./clicks/PriorityPopup.jsx
import React, { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import "./PriorityPopup.css";

const priorities = [
  { level: 1, label: "Priority 1", color: "red" },
  { level: 2, label: "Priority 2", color: "orange" },
  { level: 3, label: "Priority 3", color: "blue" },
  { level: 4, label: "Priority 4", color: "gray" },
];

const PriorityPopup = ({ anchorRef, selected, onSelect, onClose }) => {
  const popupRef = useRef(null);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  // Tính vị trí popup ngay dưới nút anchor
  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect
    ? { top: rect.bottom + 4, left: rect.left, position: "fixed" }
    : {};

  return (
    <AnimatePresence>
      <motion.div
        ref={popupRef}
        className="priority-popup"
        style={style}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.15 }}
      >
        {priorities.map((p) => (
          <div
            key={p.level}
            className={`priority-item ${selected === p.level ? "selected" : ""}`}
            onClick={() => {
              onSelect(p.level);
              onClose();
            }}
          >
            {/* Icon cờ */}
            <span className="priority-flag" style={{ color: p.color }}>
              ⚑
            </span>
            {/* Nhãn */}
            <span>{p.label}</span>
            {/* Tick ✔ nằm ngoài cùng bên phải */}
            {selected === p.level && <span className="priority-check">✔</span>}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default PriorityPopup;