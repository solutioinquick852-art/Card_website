import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: '主頁', nameEn: 'Home', path: '#home', type: 'hash'},
    // { name: '介紹', nameEn: 'Intro', path: '#intro', type: 'hash'},
    { name: '核實認證', nameEn: 'Certificate Verification', path: '#search', type: 'hash'},
    { name: '評級準則', nameEn: 'Grading Standards', path: '/grading_standard', type: 'link'},
    { name: '封套和標籤', nameEn: 'Card Holder & Label', path: '/card_holder', type: 'link'},
    { name: '服務和費用', nameEn: 'Service and Fees', path: '/service_fee', type: 'link'},
  ];

  return (
    <nav className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      <div className="navbar-container">
        {/* Hamburger 按鈕 */}
        {/* Menu */}
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) =>
            item.type === 'hash' ? (
              <HashLink
                key={item.path}
                smooth
                to={`/${item.path}`}
                className={`navbar-item ${location.hash === item.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)} // 點擊後收起
              >
                <span className="nav-text-zh">{item.name}</span>
                <span className="nav-text-en">{item.nameEn}</span>
              </HashLink>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)} // 點擊後收起
              >
                <span className="nav-text-zh">{item.name}</span>
                <span className="nav-text-en">{item.nameEn}</span>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
