import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-white text-coffee-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-lg text-coffee-900">Apo Coffee</span>
            </div>
            <p className="text-coffee-700">
              Your favorite coffee, delivered to your doorstep in Cebu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-coffee-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-coffee-700 hover:text-coffee-900 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-coffee-700 hover:text-coffee-900 transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-coffee-700 hover:text-coffee-900 transition">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-coffee-900">Contact Us</h3>
            <ul className="space-y-2 text-coffee-700">
              <li>Email: info@coffeehub.com</li>
              <li>Phone: +63 9XX XXXX XXX</li>
              <li>Location: Cebu, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-coffee-600">
          <p>&copy; 2025 CoffeeHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
