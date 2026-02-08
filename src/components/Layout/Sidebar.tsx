import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Mock recent chats data
  const recentChats = [
    { id: 1, title: 'Guideline calculation for interstate case', date: '2 hours ago' },
    { id: 2, title: 'Modification procedures for custody change', date: 'Yesterday' },
    { id: 3, title: 'Enforcement options for non-payment', date: '2 days ago' },
    { id: 4, title: 'Paternity establishment requirements', date: '3 days ago' },
  ];

  const navItems = [
    { path: '/', label: 'Chat', icon: MessageSquare },
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-navy z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                <img
                  src="/csdai-logo.png"
                  alt="CSDAI Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CSDAI</h1>
                <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                  Policy Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="px-4 mb-2">
            <button
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
          <nav className="px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
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

          {/* Recent Chats Section */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <h2 className="text-[11px] uppercase text-white/30 font-medium mb-2 px-2.5">
              Recent
            </h2>
            <div className="space-y-0.5">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-2.5 py-2 rounded-md hover:bg-white/4 transition-colors"
                >
                  <div className="text-[13px] text-white/75 truncate mb-0.5">
                    {chat.title}
                  </div>
                  <div className="text-[11px] text-white/30">{chat.date}</div>
                </button>
              ))}
            </div>
          </div>

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
                  {user?.county || 'County'} County
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
