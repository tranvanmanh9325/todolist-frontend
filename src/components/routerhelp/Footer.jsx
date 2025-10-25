import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>TodoList App</h3>
            </div>
            <p className="footer-description">
              Ứng dụng quản lý công việc hiện đại, giúp bạn tổ chức cuộc sống một cách hiệu quả và khoa học.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Sản phẩm</h4>
              <ul>
                <li><a href="#features">Tính năng</a></li>
                <li><a href="#pricing">Giá cả</a></li>
                <li><a href="#updates">Cập nhật</a></li>
                <li><a href="#roadmap">Lộ trình</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#help">Trợ giúp</a></li>
                <li><a href="#docs">Tài liệu</a></li>
                <li><a href="#contact">Liên hệ</a></li>
                <li><a href="#status">Trạng thái</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Công ty</h4>
              <ul>
                <li><a href="#about">Giới thiệu</a></li>
                <li><a href="#careers">Tuyển dụng</a></li>
                <li><a href="#privacy">Bảo mật</a></li>
                <li><a href="#terms">Điều khoản</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} TodoList App. Tất cả quyền được bảo lưu.</p>
            <p>Phát triển bởi <strong>Trần Văn Mạnh</strong> • Hà Nội, Việt Nam</p>
          </div>
          
          <div className="footer-social">
            <a href="mailto:tranvanmanh9032005@gmail.com" className="social-link" title="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <a href="https://github.com/tranvanmanh9325" className="social-link" title="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/tranvanmanh9325" className="social-link" title="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer