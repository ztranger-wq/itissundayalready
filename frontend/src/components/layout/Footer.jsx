import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>MS Enterprise</h2>
          <p className="footer-description">
            Your trusted partner for premium corporate solutions, promotional merchandise, 
            and professional services.
          </p>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <div className="contact-item">
            <FiPhone className="contact-item-icon" />
            <a href="tel:+919467283036">+91 9467283036</a>
          </div>
          <div className="contact-item">
            <FiMail className="contact-item-icon" />
            <a href="mailto:m.s.labels2009@gmail.com">m.s.labels2009@gmail.com</a>
          </div>
          <div className="contact-item">
            <FiMapPin className="contact-item-icon" />
            <span>108/25, Mohan Nagar, Sonipat, Haryana, 131001</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-navigation">
          <div className="social-links">
            <a 
              href="https://facebook.com/msenterprise" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <FiFacebook />
            </a>
            <a 
              href="https://twitter.com/msenterprise" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              <FiTwitter />
            </a>
            <a 
              href="https://instagram.com/msenterprise" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <FiInstagram />
            </a>
            <a 
              href="https://linkedin.com/company/msenterprise" 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Connect with us on LinkedIn"
            >
              <FiLinkedin />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} MS Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;