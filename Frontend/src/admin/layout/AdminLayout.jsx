import Sidebar from '../components/AdminSidebar'
import AdminNavbar from '../components/AdminNavbar'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebarMobile = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebarMobile = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen  bg-gray-50">

      {/* Desktop sidebar */}
      {isDesktop && (
        <div className={`flex-shrink-0 transition-all duration-200 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          <Sidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            isDesktop
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <AdminNavbar
          toggleSidebar={toggleSidebarMobile}
          isDesktop={isDesktop}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {!isDesktop && isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeSidebarMobile}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transition-transform transform translate-x-0">
            <Sidebar isMobile onClose={closeSidebarMobile} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;