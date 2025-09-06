import { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiPhone,
  FiSearch
} from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
    closeMobileMenu();
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <img
              src="/logo.png"
              alt="MS Enterprise"
              className="logo-img"
            />
            <span className="logo-text">MS Enterprises</span>
          </Link>
        </div>

        <div className="search-bar-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
        </div>

        <div className="profile-menu desktop-nav">
          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <FiShoppingCart className="cart-icon" />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
              <Link to="/profile" className="nav-link profile-icon-link">
                <FiUser className="profile-icon" />
                My Account
              </Link>
              <button onClick={handleContactClick} className="nav-link contact-button">
                <FiPhone className="contact-icon" />
                Contact Us
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login / Register</Link>
              <button onClick={handleContactClick} className="nav-link contact-button">
                <FiPhone className="contact-icon" />
                Contact Us
              </button>
            </>
          )}
        </div>

        <div className="mobile-menu-button-container">
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <FiX className="menu-icon" />
            ) : (
              <FiMenu className="menu-icon" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          {user ? (
            <>
              <NavLink to="/cart" className="mobile-nav-link" onClick={closeMobileMenu}>
                <FiShoppingCart className="mobile-nav-icon" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </NavLink>
              <NavLink to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                <FiUser className="mobile-nav-icon" />
                My Account
              </NavLink>
              <button onClick={handleContactClick} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'center' }}>
                <FiPhone className="mobile-nav-icon" />
                Contact Us
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
                Login / Register
              </NavLink>
              <button onClick={handleContactClick} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'center' }}>
                <FiPhone className="mobile-nav-icon" />
                Contact Us
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;