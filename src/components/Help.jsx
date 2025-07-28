import React from 'react';
import GoogleHomepage from './GoogleHomepage';
import BookmarkBar from './BookmarkBar';
import Footer from './Footer';
import './Help.css';

const Help = () => {
  return (
    <div className="help-content">
      {/* ✅ Tiêu đề nằm đầu trang */}
      <div className="help-inner">
        <h1 className="help-title">Help & Resources</h1>
      </div>

      {/* ✅ Thanh bookmark full chiều ngang */}
      <div className="bookmark-fullwidth">
        <BookmarkBar />
      </div>

      {/* ✅ Nội dung chính */}
      <div className="help-inner" style={{ flex: 1 }}>
        <GoogleHomepage />
      </div>

      {/* ✅ Footer full chiều ngang, sát đáy, không có khoảng trắng dưới */}
      <div className="bookmark-fullwidth no-bottom-margin">
        <Footer />
      </div>
    </div>
  );
};

export default Help;