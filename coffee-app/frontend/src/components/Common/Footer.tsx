import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[rgba(143,91,54,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(245,241,224,0.72))] text-coffee-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_0.7fr_0.8fr]">
          <div>
            <p className="mb-3 text-[0.7rem] uppercase tracking-[0.28em] text-coffee-500">
              Single Origin
            </p>
            <div className="mb-4 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none text-coffee-900">
              Apo Coffee
            </div>
            <p className="max-w-sm text-coffee-700">
              Warm, mountain-grown coffee with a more thoughtful online experience
              from first browse to final checkout.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-coffee-700">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-coffee-700 transition hover:text-coffee-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-coffee-700 transition hover:text-coffee-900">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-coffee-700 transition hover:text-coffee-900">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-coffee-700 transition hover:text-coffee-900">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-coffee-700">
              Contact
            </h3>
            <ul className="space-y-3 text-coffee-700">
              <li>info@apocoffee.com</li>
              <li>+63 9XX XXX XXXX</li>
              <li>Cebu, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgba(143,91,54,0.12)] pt-6 text-center text-sm text-coffee-600">
          <p>&copy; 2026 Apo Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
