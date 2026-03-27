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
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf7f0_0%,#f4ede2_100%)]">
      <header className="sticky top-0 z-40 border-b border-[rgba(143,91,54,0.12)] bg-[rgba(250,249,245,0.9)]">
        <div className="container flex items-center justify-between py-5">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-coffee-500">Admin Studio</p>
            <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-none text-neutral-900">
              Mt. Apo Coffee
            </h1>
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
                      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary-black text-white shadow-sm"
                        : "text-neutral-700 hover:bg-white/80",
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

      <div className="container py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-5xl font-semibold leading-none text-neutral-900">
              {title}
            </h2>
            {subtitle && (
              <p className="max-w-2xl text-sm text-neutral-600 md:text-base">
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
