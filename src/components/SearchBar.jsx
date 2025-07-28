import React from 'react'
import './SearchBar.css'

const SearchBar = () => {
  return (
    <div className="search-container">
      <form className="search-form">
        <div className="search-bar">
          <div className="search-icon">
            {/* ✅ Icon chấm than (thông tin) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                   10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                fill="#5f6368"
              />
            </svg>
          </div>
          {/* ✅ Dòng chữ thay vì input */}
          <span className="search-placeholder">
            Bạn có thể ấn nút trong trang để biết thêm thông tin hoặc liên hệ với tôi
          </span>
        </div>
      </form>
    </div>
  )
}

export default SearchBar