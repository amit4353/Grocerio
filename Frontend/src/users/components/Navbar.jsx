import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { logoutUser } from '../../services/authServices';

const Navbar = ({ cartItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input with current URL query (for when user navigates back)
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchValue(query);
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      toast.success(res.data?.message || 'Logout successfully', { duration: 2000 });
      localStorage.removeItem('token');
      navigate('/users/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchValue('');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-sm rounded-b-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link onClick={() => window.location.reload()} to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Grocerio
            </Link>
          </div>

          {/* Center: Search Bar (desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="search"
                placeholder="Search groceries..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Right: Navigation Links (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/">Home</NavLink>
            
            {!isAuthenticated ? (
              <>
                <NavLink to="/users/login">Login</NavLink>
                <NavLink to="/users/register">Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/cart" className="relative">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-300">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/orders">Orders</NavLink>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-500 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-offset-2 rounded-lg px-2 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white cursor-pointer">
                      <User className="h-4 w-4 cursor-pointer" />
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg animate-scaleIn">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/users/profile');
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate('/users/update/password');
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Change password
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 backdrop-blur-md bg-white/70 rounded-b-xl animate-fadeIn">
            <div className="relative px-4 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="search"
                  placeholder="Search groceries..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            <MobileNavLink to="/" onClick={handleMobileLinkClick}>Home</MobileNavLink>
            <MobileNavLink to="/cart" onClick={handleMobileLinkClick} className="flex items-center justify-between">
              Cart
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </MobileNavLink>
            <MobileNavLink to="/orders" onClick={handleMobileLinkClick}>Orders</MobileNavLink>
            {!isAuthenticated ? (
              <>
                <MobileNavLink to="/users/login" onClick={handleMobileLinkClick}>Login</MobileNavLink>
                <MobileNavLink to="/users/register" onClick={handleMobileLinkClick}>Register</MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/profile" onClick={handleMobileLinkClick}>My Profile</MobileNavLink>
                <MobileNavLink to="/settings" onClick={handleMobileLinkClick}>Settings</MobileNavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    handleMobileLinkClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-500 hover:bg-red-50 transition-all duration-300 ease-in-out"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
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

// Desktop nav link using React Router Link
const NavLink = ({ to, children, className = '' }) => (
  <Link
    to={to}
    className={`text-gray-700 hover:text-primary-500 hover:scale-105 transition-all duration-300 ease-in-out ${className}`}
  >
    {children}
  </Link>
);

// Mobile nav link using React Router Link
const MobileNavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2 text-gray-700 hover:text-primary-500 hover:bg-primary-50 transition-all duration-300 ease-in-out ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;