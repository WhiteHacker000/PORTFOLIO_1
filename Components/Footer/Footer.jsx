import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <span className="copyright-text">© {currentYear} Your Name</span>
        </div>
      </div>
      
      <div className="footer-glow-line"></div>
    </footer>
  );
};

export default Footer;
