import React from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: '主頁', nameEn: 'Home', path: '#home' },
    { name: '功能介紹', nameEn: 'Features', path: '#intro' },
    { name: '搜卡', nameEn: 'Search', path: '#search' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <HashLink smooth to="/#home" className="navbar-logo">
          <img className="logo-img" src="/src/assets/logo.png" alt="寶可夢卡牌查詢" />
        </HashLink>
        <div className="navbar-menu">
          {navItems.map((item) => (
            <HashLink
              key={item.path}
              smooth
              to={`/${item.path}`}
              className={`navbar-item ${location.hash === item.path ? 'active' : ''}`}
            >
              <span className="nav-text-zh">{item.name}</span>
              <span className="nav-text-en">{item.nameEn}</span>
            </HashLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
