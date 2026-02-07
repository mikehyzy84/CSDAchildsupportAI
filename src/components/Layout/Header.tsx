import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, FileText, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Search', icon: Search },
    { path: '/reports', label: 'Reports', icon: FileText },
    ...(hasRole(['Manager', 'Admin']) ? [{ path: '/admin', label: 'Admin', icon: Settings }] : [])
  ];

  return (
    <header className="bg-[#14558f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <img
                src="/CSDAI Logo.png"
                alt="CSDAI Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold">CSDAI</h1>
              <p className="text-sm text-white opacity-90 whitespace-nowrap">Child Support Directors Association Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 h-10 whitespace-nowrap ${
                  location.pathname === path
                    ? 'bg-white/20 text-white'
                    : 'text-white opacity-80 hover:bg-white/10 hover:text-white hover:opacity-100'
                }`}
              >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm whitespace-nowrap">
              <User size={16} />
              <span>{user?.name}</span>
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white opacity-80 hover:text-white hover:opacity-100 hover:bg-white/10 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;