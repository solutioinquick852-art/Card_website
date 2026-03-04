import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: '主頁', nameEn: 'Home', path: '/#home' },
    { name: '功能介紹', nameEn: 'Features', path: '/#intro' },
    { name: '搜卡', nameEn: 'Search', path: '/#search' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">寶可夢卡牌查詢</span>
        </Link>
        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/') ? 'active' : ''}`}
            >
              <span className="nav-text-zh">{item.name}</span>
              <span className="nav-text-en">{item.nameEn}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
