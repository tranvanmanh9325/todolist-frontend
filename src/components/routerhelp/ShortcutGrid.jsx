import React from 'react'
import './ShortcutGrid.css'

const ShortcutGrid = () => {
  const shortcuts = [
    {
      name: 'Facebook',
      image: '/facebook-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://www.facebook.com/manh090305'
    },
    {
      name: 'GitHub',
      image: '/github-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://github.com/tranvanmanh9325'
    },
    {
      name: 'LinkedIn',
      image: '/linkedin-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://www.linkedin.com/in/mannh090305/'
    },
    {
      name: 'Tiktok',
      image: '/tiktok-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://www.tiktok.com/@tranvanmanh935'
    },
    {
      name: 'Youtube',
      image: '/youtube-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://www.youtube.com/@tranvanmanhofficial'
    },
    {
      name: 'Gmail',
      image: '/gmail-icon.svg', // dùng ảnh SVG
      bgColor: '#f1f3f4',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=tranvanmanh9032005@gmail.com&su=Liên%20hệ%20từ%20website%20To-Do%20List&body=Chào%20Mạnh,%20tôi%20muốn%20trao%20đổi%20với%20bạn...'
    }
  ]

  const handleShortcutClick = (shortcut) => {
    if (shortcut.isAddButton) {
      // Handle add shortcut functionality
      console.log('Add shortcut clicked')
    } else {
      window.open(shortcut.url, '_blank')
    }
  }

  return (
    <div className="shortcuts-container">
      <div className="shortcuts-grid">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="shortcut-item"
            onClick={() => handleShortcutClick(shortcut)}
          >
            <div
              className="shortcut-icon"
              style={{ backgroundColor: shortcut.bgColor }}
            >
              {shortcut.image ? (
                <img
                  src={shortcut.image}
                  alt={shortcut.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                shortcut.icon
              )}
            </div>
            <span className="shortcut-name">{shortcut.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShortcutGrid