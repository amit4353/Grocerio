import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, CreditCard, Settings, LogOut, ChevronDown, ChevronRight, X } from 'lucide-react';

const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isDesktop = true,
  isMobile = false,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleNav = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const isActive = (path) => location.pathname === path;

  // Main navigation items (excluding Dashboard and Settings)
  const mainItems = [
    // Dashboard removed as requested
    { icon: ShoppingCart, label: 'Orders', path: null, hasSubmenu: true }, // Orders with submenu
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    // Settings moved to bottom, so removed from here
  ];

  // Products submenu (already present)
  const productSubmenu = {
    label: 'Products',
    icon: Package,
    items: [
      { label: 'All Products', path: '/products' },
      { label: 'Add Product', path: '/products/add' },
    ],
  };

  // Orders submenu (new)
  const ordersSubmenu = {
    label: 'Orders',
    icon: ShoppingCart,
    items: [
      { label: 'All Orders', path: '/admin/orders/users/order' },
      { label: 'Recent Orders', path: '/admin/orders/recent-orders' },
      { label: 'Cancelled Orders', path: '/admin/orders/cancelled-orders' },
    ],
  };

  const renderNavItem = (item) => (
    <button
      key={item.path}
      onClick={() => handleNav(item.path)}
      className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
        isActive(item.path)
          ? 'bg-gray-100 text-primary-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="ml-3">{item.label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      )}
    </button>
  );

  const renderSubmenu = (submenu) => {
    const isExpanded = expandedMenu === submenu.label;
    const Icon = submenu.icon;
    return (
      <div className="mt-1">
        <button
          onClick={() => toggleSubmenu(submenu.label)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
            submenu.items.some(item => isActive(item.path))
              ? 'bg-gray-100 text-primary-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <Icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3">{submenu.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {submenu.label}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>
        {!isCollapsed && isExpanded && (
          <div className="ml-7 mt-1 space-y-1 overflow-hidden transition-all duration-200">
            {submenu.items.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Grocerio Admin
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Management Panel</p>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
            G
          </div>
        )}
        {/* Collapse toggle only on desktop */}
        {isDesktop && !isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronRight
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Products submenu (already present) */}
        {renderSubmenu(productSubmenu)}
        {/* Orders submenu (new) */}
        {renderSubmenu(ordersSubmenu)}
        {/* Users */}
        <button
          onClick={() => handleNav('/admin/users')}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
            isActive('/admin/users')
              ? 'bg-gray-100 text-primary-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">Users</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Users
            </div>
          )}
        </button>
        {/* Payments */}
        <button
          onClick={() => handleNav('/admin/payments')}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
            isActive('/admin/payments')
              ? 'bg-gray-100 text-primary-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">Payments</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Payments
            </div>
          )}
        </button>
      </nav>

      {/* Bottom Section: Settings (replaces Logout) */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => handleNav('/admin/settings')}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
            isActive('/admin/settings')
              ? 'bg-gray-100 text-primary-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </button>
      </div>
    </div>
  );

  // Desktop sidebar: always visible
  if (!isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    );
  }

  // Mobile sidebar: slide-in
  return (
    <>
      {/* Overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={() => onClose()}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-200 ease-in-out ${
          isMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onClose()}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;