import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";
import logo from "../../Images/Logo.jpg";
// Tailwind is used for styling, previous CSS file removed

const Navbar: React.FC = () => {
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
    <header className="sticky top-0 z-50 bg-coffee-50 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Apo Coffee Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-xl font-extrabold text-coffee-900">
            Apo Coffee
          </span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 text-coffee-700">
          <li>
            <Link
              to="/"
              className="relative py-2 hover:text-coffee-900 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              className="relative py-2 hover:text-coffee-900 transition"
            >
              Menu
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                to="/orders"
                className="relative py-2 hover:text-coffee-900 transition"
              >
                Orders
              </Link>
            </li>
          )}
        </ul>

        {/* right actions */}
        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative p-2 text-coffee-700 hover:text-coffee-900 transition"
          >
            {/* simple cart icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6m0 0H17m-10 0a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z"
              />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-coffee-700 text-pure-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {items.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-coffee-700 hover:text-coffee-900 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 18a8 8 0 0116 0H2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">{user?.name || "User"}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-coffee-700 hover:bg-coffee-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-coffee-700 hover:bg-coffee-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="text-coffee-700 hover:text-coffee-900 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-coffee-500 text-pure-white rounded-lg hover:bg-coffee-600 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* mobile toggle */}
          <button
            className="md:hidden p-2 text-coffee-700 hover:text-coffee-900"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-coffee-50 px-6 pb-4 space-y-2">
          <Link
            to="/"
            className="block py-2 text-coffee-700 hover:text-coffee-900"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="block py-2 text-coffee-700 hover:text-coffee-900"
            onClick={toggleMobileMenu}
          >
            Menu
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              className="block py-2 text-coffee-700 hover:text-coffee-900"
              onClick={toggleMobileMenu}
            >
              Orders
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="block py-2 text-coffee-700 hover:text-coffee-900"
              onClick={toggleMobileMenu}
            >
              Profile
            </Link>
          )}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="block py-2 text-coffee-700 hover:text-coffee-900"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 text-coffee-700 hover:text-coffee-900"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-coffee-700 hover:text-coffee-900"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
