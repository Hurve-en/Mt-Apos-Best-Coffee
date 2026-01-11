import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../redux/slices/authSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { items } = useAppSelector((state: any) => state.cart);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-coffee-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <span className="text-2xl">☕</span>
            <span className="font-bold text-xl hidden sm:inline">CoffeeHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-coffee-200 transition">
              Home
            </Link>
            <Link to="/menu" className="hover:text-coffee-200 transition">
              Menu
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-coffee-200 transition">
                Orders
              </Link>
            )}
          </div>

          {/* Right side - Cart & Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-coffee-200 transition">
              <span className="text-2xl">🛒</span>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-coffee-200 transition"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm hidden sm:inline">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-coffee-900 rounded-lg shadow-xl z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-coffee-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-coffee-100 transition border-t"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2 flex">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm rounded hover:bg-coffee-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm bg-coffee-700 rounded hover:bg-coffee-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;