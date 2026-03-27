import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import "../../styles/premium.css";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  showNavLinks?: boolean;
}

const navLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Home", to: "/" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
];

export default function AdminLayout({
  title,
  subtitle,
  actions,
  children,
  showNavLinks = true,
}: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
            <h1 className="text-xl font-bold text-neutral-900">Mt. Apo Coffee</h1>
          </div>
          {showNavLinks && (
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={classNames(
                      "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary-black text-white shadow-sm"
                        : "text-neutral-700 hover:bg-neutral-100",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Page header */}
      <div className="container py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
            {subtitle && (
              <p className="text-neutral-600 max-w-2xl text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>

      {/* Content */}
      <main className="container pb-12">{children}</main>
    </div>
  );
}
