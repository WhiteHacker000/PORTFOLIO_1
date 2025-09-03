import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
        </div>
        
        <div className="footer-contact">
          <h3>Get In Touch</h3>
          
          <div className="query-section">
            <h4>Have a Question?</h4>
            <form className="query-form">
              <textarea 
                className="query-input" 
                placeholder="Type your message here..."
                rows="4"
              ></textarea>
              <div className="button-email-row">
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
                <div className="contact-info">
                  <p className="contact-email">
                    <span className="email-label">Email:</span>
                    <a href="mailto:kushalvats1316@gmail.com" className="email-link">
                      kushalvats1316@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-glow-line"></div>
    </footer>
  );
};

export default Footer;
