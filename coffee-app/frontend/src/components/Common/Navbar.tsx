import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";
import "./Navbar.module.css";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const { items } = useAppSelector((state: any) => state.cart);

  const handleLogout = (): void => {
    dispatch(logout());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-nav">
        <div className="navbar-container">
          {/* Logo Section */}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">☕</span>
            <span className="logo-text">Apo Coffee</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <ul className="navbar-menu">
            <li className="menu-item">
              <Link to="/" className="menu-link">
                Home
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/menu" className="menu-link">
                Menu
              </Link>
            </li>
            {isAuthenticated && (
              <li className="menu-item">
                <Link to="/orders" className="menu-link">
                  Orders
                </Link>
              </li>
            )}
          </ul>

          {/* Right Section */}
          <div className="navbar-actions">
            {/* Cart Icon */}
            <Link to="/cart" className="cart-button">
              <svg
                className="cart-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {items.length > 0 && (
                <span className="cart-badge">{items.length}</span>
              )}
            </Link>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="user-section">
                <button className="user-menu-button">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.name || "User"}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                <Link to="/register" className="auth-button-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link
              to="/"
              className="mobile-menu-item"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="mobile-menu-item"
              onClick={toggleMobileMenu}
            >
              Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="mobile-menu-item"
                onClick={toggleMobileMenu}
              >
                Orders
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="mobile-menu-item"
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="mobile-menu-item"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-menu-item"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mobile-menu-item logout"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
