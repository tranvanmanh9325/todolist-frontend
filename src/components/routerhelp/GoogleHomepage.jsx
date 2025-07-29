import React, { useState } from 'react';
import SearchBar from './SearchBar';
import ShortcutGrid from './ShortcutGrid';
import './GoogleHomepage.css';

const GoogleHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="google-homepage">
      {/* ✅ Đổi className để không xung đột với ToDoApp */}
      <main className="google-main-content">
        <div className="google-logo">
          <span style={{ color: '#4285F4' }}>T</span>
          <span style={{ color: '#EA4335' }}>r</span>
          <span style={{ color: '#FBBC05' }}>ầ</span>
          <span style={{ color: '#34A853' }}>n</span>
          &nbsp;
          <span style={{ color: '#4285F4' }}>V</span>
          <span style={{ color: '#EA4335' }}>ă</span>
          <span style={{ color: '#FBBC05' }}>n</span>
          &nbsp;
          <span style={{ color: '#34A853' }}>M</span>
          <span style={{ color: '#EA4335' }}>ạ</span>
          <span style={{ color: '#FBBC05' }}>n</span>
          <span style={{ color: '#4285F4' }}>h</span>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ShortcutGrid />
      </main>
    </div>
  );
};

export default GoogleHomepage;