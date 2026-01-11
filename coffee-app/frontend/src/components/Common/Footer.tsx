import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-coffee-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">☕</span>
              <span className="font-bold text-lg">CoffeeHub</span>
            </div>
            <p className="text-coffee-300">
              Your favorite coffee, delivered to your doorstep in Cebu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-coffee-300">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/menu" className="hover:text-white transition">
                  Menu
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition">
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-coffee-300">
              <li>📧 info@coffeehub.com</li>
              <li>📱 +63 9XX XXXX XXX</li>
              <li>📍 Cebu, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-8 pt-8 text-center text-coffee-300">
          <p>&copy; 2025 CoffeeHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;