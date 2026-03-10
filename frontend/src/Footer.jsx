import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
            <div className="footer-links">
            <Link to="/term_of_use">服務條款 Term of Use</Link> |{" "}
            <Link to="/contact_us">聯絡我們 Contact Us</Link>
          </div>
          <p className="copyright">
            © {currentYear} Sam Tam. 保留所有權利.
          </p>
          <p className="copyright-en">
            © {currentYear} Sam Tam. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
