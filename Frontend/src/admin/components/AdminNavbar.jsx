// AdminNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import { logoutUser } from '../../services/authServices';
import toast from 'react-hot-toast';

const AdminNavbar = ({ toggleSidebar, isDesktop }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'New order #1234 received', time: '2 min ago' },
    { id: 2, text: 'Payment successful for order #1235', time: '10 min ago' },
    { id: 3, text: 'User john@example.com registered', time: '1 hour ago' },
  ];

const handleLogout = async () => {
    try{
        const res = await logoutUser()
        console.log(res);
        toast.success(res?.message);
        navigate('/users/login');

    } catch(err){
        toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleProfileClick = (path) => {
    navigate(path);
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Hamburger + Dashboard Title */}
        <div className="flex items-center gap-3">
          {!isDesktop && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-lg font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-800 hover:text-primary-600'
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? 'scale-[1.02]' : ''
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle (placeholder) */}
          {/* <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">
            <Moon className="h-5 w-5" />
          </button> */}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-lg animate-scaleIn">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    View all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                Admin
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg animate-scaleIn">
                <div className="p-2">
                  <button
                    onClick={() => handleProfileClick('/admin/profile')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => handleProfileClick('/admin/update/password')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Change Password
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="block md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default AdminNavbar;