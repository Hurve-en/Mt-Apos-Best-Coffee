import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";
import logo from "../../Images/Logo.jpg";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const { items } = useAppSelector((state: any) => state.cart);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const delayedClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setUserMenuOpen(false);
    }, 160);
  };

  const handleLogout = (): void => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      clearCloseTimer();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(143,91,54,0.14)] bg-[rgba(250,249,245,0.9)]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Apo Coffee Logo"
            className="h-11 w-11 rounded-full border border-coffee-200 object-cover"
          />
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-coffee-500">
              Mt. Apo Roast
            </p>
            <span className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-none text-coffee-900">
              Apo Coffee
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-10 text-coffee-700">
          <li>
            <Link to="/" className="relative py-2 text-sm tracking-[0.18em] uppercase hover:text-coffee-900 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" className="relative py-2 text-sm tracking-[0.18em] uppercase hover:text-coffee-900 transition">
              Menu
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders" className="relative py-2 text-sm tracking-[0.18em] uppercase hover:text-coffee-900 transition">
                Orders
              </Link>
            </li>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <li>
              <Link
                to="/admin/dashboard"
                className="relative py-2 text-sm tracking-[0.18em] uppercase hover:text-coffee-900 transition"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(143,91,54,0.18)] bg-white/80 text-coffee-700 transition hover:-translate-y-0.5 hover:text-coffee-900"
          >
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coffee-700 text-xs text-pure-white">
                {items.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={() => {
                clearCloseTimer();
                setUserMenuOpen(true);
              }}
              onMouseLeave={delayedClose}
            >
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 rounded-full border border-[rgba(143,91,54,0.18)] bg-white/80 px-4 py-2 text-coffee-700 transition hover:-translate-y-0.5 hover:text-coffee-900"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
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
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name || "User"}
                </span>
              </button>

              <div
                className={`absolute right-0 top-full pt-2 transition-all duration-150 ${
                  userMenuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="w-48 rounded-2xl border border-[rgba(143,91,54,0.14)] bg-white/95 py-2 shadow-xl">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-coffee-700 hover:bg-coffee-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-coffee-700 hover:bg-coffee-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(143,91,54,0.18)] px-5 text-sm font-semibold text-coffee-800 transition-all hover:border-coffee-700 hover:bg-white hover:text-coffee-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-11 items-center justify-center rounded-full bg-coffee-700 px-5 text-sm font-semibold text-pure-white shadow-sm transition-all hover:bg-coffee-800"
              >
                Register
              </Link>
            </div>
          )}

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

          {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(143,91,54,0.14)] bg-[rgba(250,249,245,0.96)] px-6 pb-5 pt-3 space-y-2">
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
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="block py-2 text-coffee-700 hover:text-coffee-900"
              onClick={toggleMobileMenu}
            >
              Dashboard
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
