import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <p>Follow us on social media</p>
      <div className="social-media">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
      <p className="copy-right">&copy; 2024 School Lunch Boxes Multan. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
