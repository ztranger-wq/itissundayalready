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
            <a href="tel:+1234567890">+91 12345 67890</a>
          </div>
          <div className="contact-item">
            <FiMail className="contact-item-icon" />
            <a href="mailto:info@msenterprise.com">info@msenterprise.com</a>
          </div>
          <div className="contact-item">
            <FiMapPin className="contact-item-icon" />
            <span>Bangalore, Karnataka, India</span>
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