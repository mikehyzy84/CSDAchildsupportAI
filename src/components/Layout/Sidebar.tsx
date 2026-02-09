import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { path: '/', label: 'Ask CSDAI', icon: Bot },
    { path: '/search', label: 'Search Docs', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  const getCountyDisplay = () => {
    if (user?.county && user.county !== 'County') {
      return `${user.county} County`;
    }
    return 'County Not Set';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-90 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-navy z-100 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:z-50`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-5 py-6">
            {/* Logo Container */}
            <div className="flex justify-center mb-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '180px',
                  height: '64px',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <img
                  src="/csda-logo.png"
                  alt="CSDA Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>

            {/* Logo Text */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-white mb-1">CSDAI</h1>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                Policy Intelligence
              </p>
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="px-4 mb-2">
            <button
              onClick={() => {
                navigate('/');
                onToggle?.(); // Close sidebar on mobile
              }}
              className="w-full px-3.5 py-2.5 rounded-lg text-teal-light text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
              }}
            >
              <Plus size={16} />
              New Conversation
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onToggle}
                  className={`flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/8 text-white'
                      : 'text-white/60 hover:bg-white/4'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div
            className="px-4 py-4"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-teal-light text-sm font-semibold"
                style={{ background: 'rgba(14, 165, 233, 0.2)' }}
              >
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/80 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-[10px] text-white/35 truncate">
                  {getCountyDisplay()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
