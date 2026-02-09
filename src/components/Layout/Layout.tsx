import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="fixed z-110 bg-white border border-gray-300 rounded-lg flex items-center justify-center lg:hidden shadow-md hover:shadow-lg transition-shadow"
        style={{
          top: '16px',
          left: '16px',
          width: '44px',
          height: '44px',
        }}
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Main Content Area */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
