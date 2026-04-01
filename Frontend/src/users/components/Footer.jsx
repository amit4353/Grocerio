import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Grocerio</h3>
            <p className="text-gray-600 mb-3">Fresh groceries delivered to your doorstep</p>
            <p className="text-sm text-gray-500">
              We bring farm-fresh produce, dairy, and pantry essentials straight to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Cart
                </a>
              </li>
              <li>
                <a href="/orders" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Orders
                </a>
              </li>
              <li>
                <a href="/users/login" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Login / Register
                </a>
              </li>
            </ul>
          </div>

          {/* Categories (static) */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-green-600 transition-colors duration-200 cursor-default">
                Fruits
              </li>
              <li className="text-gray-600 hover:text-green-600 transition-colors duration-200 cursor-default">
                Vegetables
              </li>
              <li className="text-gray-600 hover:text-green-600 transition-colors duration-200 cursor-default">
                Dairy
              </li>
              <li className="text-gray-600 hover:text-green-600 transition-colors duration-200 cursor-default">
                Snacks
              </li>
            </ul>
          </div>

          {/* Contact / Support */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@grocerio.com</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8368619855</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-end space-x-6 mt-8 max-2xl:pr-27 max-md:justify-center">
          <a href="#" className="text-gray-400 hover:text-green-600 transition-colors duration-200">
            <span className="sr-only">Facebook</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-green-600 transition-colors duration-200">
            <span className="sr-only">Instagram</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.526.204.992.477 1.39.875.398.398.67.864.875 1.39.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-.875 1.39 4.902 4.902 0 01-1.39.875c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.39-.875 4.902 4.902 0 01-.875-1.39c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427.204-.526.477-.992.875-1.39.398-.398.864-.67 1.39-.875.636-.247 1.363-.416 2.427-.465 1.024-.048 1.378-.06 3.808-.06zM12.315 4c-2.36 0-2.639.009-3.564.052-1.07.05-1.65.224-2.037.372-.512.198-.878.435-1.262.819-.384.384-.621.75-.819 1.262-.148.387-.322.967-.372 2.037-.043.925-.052 1.204-.052 3.564s.009 2.639.052 3.564c.05 1.07.224 1.65.372 2.037.198.512.435.878.819 1.262.384.384.75.621 1.262.819.387.148.967.322 2.037.372.925.043 1.204.052 3.564.052s2.639-.009 3.564-.052c1.07-.05 1.65-.224 2.037-.372.512-.198.878-.435 1.262-.819.384-.384.621-.75.819-1.262.148-.387.322-.967.372-2.037.043-.925.052-1.204.052-3.564s-.009-2.639-.052-3.564c-.05-1.07-.224-1.65-.372-2.037-.198-.512-.435-.878-.819-1.262-.384-.384-.75-.621-1.262-.819-.387-.148-.967-.322-2.037-.372-.925-.043-1.204-.052-3.564-.052z" />
              <path d="M12.315 7.385a4.93 4.93 0 100 9.86 4.93 4.93 0 000-9.86zm0 8.13a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.925 7.385a1.15 1.15 0 100-2.3 1.15 1.15 0 000 2.3z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-green-600 transition-colors duration-200">
            <span className="sr-only">Twitter</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-green-600 transition-colors duration-200">
            <span className="sr-only">LinkedIn</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Grocerio. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for fresh groceries
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;