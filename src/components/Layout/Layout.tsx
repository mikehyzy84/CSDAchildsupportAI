import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
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
        className="fixed top-4 left-4 z-30 w-10 h-10 bg-navy rounded-lg flex items-center justify-center text-white lg:hidden shadow-lg"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Main Content Area */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
