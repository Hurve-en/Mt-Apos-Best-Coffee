import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";

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
    <header className="sticky top-0 z-1000 bg-white border-b border-gray-200 shadow-sm">
      <nav className="w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-900 font-bold text-xl no-underline cursor-pointer whitespace-nowrap flex-shrink-0 hover:text-orange-500 transition-colors duration-300"
          >
            <span className="text-2xl">☕</span>
            <span className="font-sans tracking-tight hidden sm:inline">
              Apo Coffee
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex list-none gap-0 m-0 p-0 flex-1">
            <li>
              <Link
                to="/"
                className="block px-5 py-3 text-gray-700 no-underline font-medium text-sm hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                className="block px-5 py-3 text-gray-700 no-underline font-medium text-sm hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
              >
                Menu
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/orders"
                  className="block px-5 py-3 text-gray-700 no-underline font-medium text-sm hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500 transition-all duration-300"
                >
                  Orders
                </Link>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center text-gray-700 cursor-pointer no-underline transition-colors duration-300 hover:text-orange-500 p-2"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Section or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-none border border-gray-200 px-4 py-2 rounded cursor-pointer font-medium text-gray-900 text-sm transition-all duration-300 hover:border-orange-500 hover:text-orange-500">
                  <span className="text-xl">👤</span>
                  <span className="max-w-xs overflow-hidden text-ellipsis hidden sm:inline">
                    {user?.name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 bg-white border border-gray-200 rounded shadow-lg min-w-40 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 pointer-events-none group-hover:pointer-events-auto">
                  <Link
                    to="/profile"
                    className="block w-full px-4 py-3 text-left text-gray-700 no-underline font-medium text-sm transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left bg-none border-none text-red-700 font-medium text-sm cursor-pointer transition-all duration-300 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex gap-4 items-center">
                <Link
                  to="/login"
                  className="text-gray-700 no-underline font-semibold transition-colors duration-300 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-5 py-2 rounded no-underline font-semibold text-sm transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="hidden md:hidden bg-none border-none cursor-pointer text-gray-900 p-2 transition-colors duration-300 hover:text-orange-500"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
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
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <Link
              to="/"
              className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
              onClick={toggleMobileMenu}
            >
              Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                onClick={toggleMobileMenu}
              >
                Orders
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-6 py-3 text-gray-700 no-underline font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block w-full px-6 py-3 text-left bg-none border-none text-red-700 font-medium cursor-pointer transition-all duration-300 hover:bg-red-50"
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
