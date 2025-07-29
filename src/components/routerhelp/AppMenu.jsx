import React from 'react'
import './AppMenu.css'

const apps = [
  { name: 'Facebook', icon: '/facebook-icon.svg', link: 'https://www.facebook.com/manh090305' },
  { name: 'Gmail', icon: '/gmail-icon.svg', link: 'https://mail.google.com/mail/?view=cm&fs=1&to=tranvanmanh9032005@gmail.com&su=Liên%20hệ%20từ%20website%20To-Do%20List&body=Chào%20Mạnh,%20tôi%20muốn%20trao%20đổi%20với%20bạn...' },
  { name: 'YouTube', icon: '/youtube-icon.svg', link: 'https://www.youtube.com/@tranvanmanhofficial' },
  { name: 'Tiktok', icon: '/tiktok-icon.svg', link: 'https://www.tiktok.com/@tranvanmanh935' },
  { name: 'LinkedIn', icon: '/linkedin-icon.svg', link: 'https://www.linkedin.com/in/mannh090305/' },
  { name: 'GitHub', icon: '/github-icon.svg', link: 'https://github.com/tranvanmanh9325' },
  { name: 'Hình ảnh', icon: '/image-icon.svg', link: 'https://github.com/tranvanmanh9325/interactive-image' },
  { name: 'Nguồn trang', icon: '/resource-icon.svg', link: 'https://github.com/tranvanmanh9325/todolist-frontend' }
]

const AppMenu = ({ onClose, position }) => {
  return (
    <div className="app-menu-overlay" onClick={onClose}>
      <div
        className="app-menu"
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-grid">
          {apps.map((app, index) => (
            <div
              key={index}
              className="app-item"
              onClick={() => window.open(app.link, '_blank')}
            >
              <img src={app.icon} alt={app.name} className="app-icon" />
              <div className="app-name">{app.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AppMenu