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
    <header className="bg-navy text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                src="/CSDAI%20NEW%20LOGO.png"
                alt="CSDAI Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-lg font-bold">CSDAI</h1>
              <p className="text-xs text-white/80 whitespace-nowrap">Child Support Directors Association Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === path
                    ? 'bg-teal text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
            </div>
          </nav>

          {/* Disclaimer Pill & User Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="hidden xl:flex items-center px-3 py-1.5 bg-amber/20 border border-amber/30 rounded-full">
              <span className="text-xs text-amber font-medium whitespace-nowrap">Policy guidance only — not legal advice</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <User size={16} className="text-white/70" />
              <span className="text-white/90">{user?.name}</span>
              <span className="px-2 py-0.5 bg-teal/20 rounded text-xs font-medium text-teal">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
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
