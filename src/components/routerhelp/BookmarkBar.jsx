import React, { useState, useRef } from 'react'
import './BookmarkBar.css'
import AppMenu from './AppMenu'

const BookmarkBar = () => {
  const [showAppMenu, setShowAppMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 48 })
  const appButtonRef = useRef(null)

  const toggleAppMenu = () => {
    if (showAppMenu) {
      setShowAppMenu(false)
    } else {
      const rect = appButtonRef.current.getBoundingClientRect()
      setMenuPosition({
        left: rect.left,
        top: rect.bottom + window.scrollY
      })
      setShowAppMenu(true)
    }
  }

  return (
    <>
      <div className="bookmark-bar">
        <div className="bookmark-items">
          <div
            className="bookmark-item"
            onClick={toggleAppMenu}
            ref={appButtonRef}
          >
            {/* ✅ Icon ứng dụng 9 ô vuông nhiều màu */}
            <div className="google-apps-icon">
              <div style={{ backgroundColor: '#ea4335' }} />
              <div style={{ backgroundColor: '#fbbc05' }} />
              <div style={{ backgroundColor: '#34a853' }} />
              <div style={{ backgroundColor: '#4285f4' }} />
              <div style={{ backgroundColor: '#34a853' }} />
              <div style={{ backgroundColor: '#fbbc05' }} />
              <div style={{ backgroundColor: '#ea4335' }} />
              <div style={{ backgroundColor: '#4285f4' }} />
              <div style={{ backgroundColor: '#fbbc05' }} />
            </div>
            <span className="bookmark-name">Ứng dụng</span>
          </div>
        </div>

        <div className="user-section">
          <span
            className="gmail-link"
            onClick={() =>
              window.open(
                'https://mail.google.com/mail/?view=cm&fs=1&to=tranvanmanh9032005@gmail.com&su=Liên%20hệ%20từ%20website%20To-Do%20List&body=Chào%20Mạnh,%20tôi%20muốn%20trao%20đổi%20với%20bạn...',
                '_blank'
              )
            }
          >
            Gmail
          </span>

          <span
            className="images-link"
            onClick={() =>
              window.open('https://github.com/tranvanmanh9325/interactive-image', '_blank')
            }
          >
            Hình ảnh
          </span>

          <div
            className="user-avatar"
            onClick={() =>
              window.open('https://github.com/tranvanmanh9325/todolist-frontend', '_blank')
            }
          >
            <img src="/avatar.jpg" alt="User" />
          </div>
        </div>
      </div>

      {/* ✅ AppMenu nhận vị trí để hiển thị đúng chỗ */}
      {showAppMenu && (
        <AppMenu
          onClose={() => setShowAppMenu(false)}
          position={menuPosition}
        />
      )}
    </>
  )
}

export default BookmarkBar