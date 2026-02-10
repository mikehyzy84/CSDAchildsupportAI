import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, Bot, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSession {
  session_id: string;
  first_question: string;
  message_count: number;
  last_updated: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  const navItems = [
    { path: '/', label: 'Ask CSDAI', icon: Bot },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/reports', label: 'Reports', icon: MessageSquare },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingChats(true);
      const response = await fetch('/api/chat-history');
      if (!response.ok) throw new Error('Failed to load chat history');

      const data = await response.json();
      setRecentChats(data.sessions || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateQuestion = (question: string, maxLength = 35) => {
    if (question.length <= maxLength) return question;
    return question.substring(0, maxLength) + '...';
  };

  const handleNewConversation = () => {
    navigate('/chat', { state: { newChat: true } });
    onToggle?.();
  };

  const handleSelectChat = (sessionId: string) => {
    navigate('/chat', { state: { loadSessionId: sessionId } });
    onToggle?.();
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
                  src="/CSDAI NEW LOGO.png"
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
              onClick={handleNewConversation}
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

          {/* Chat History Section */}
          <div className="px-4 py-2 flex-1 overflow-y-auto">
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">
                Recent Chats
              </h3>
            </div>
            {isLoadingChats ? (
              <div className="px-3 py-4 text-xs text-white/40 text-center">
                Loading...
              </div>
            ) : recentChats.length === 0 ? (
              <div className="px-3 py-4 text-xs text-white/40 text-center">
                No recent chats
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentChats.map((chat) => (
                  <button
                    key={chat.session_id}
                    onClick={() => handleSelectChat(chat.session_id)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-white/60 hover:bg-white/4 transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-white/40" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate group-hover:text-white/80 transition-colors">
                          {truncateQuestion(chat.first_question)}
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(chat.last_updated)}
                          <span className="mx-1">•</span>
                          {chat.message_count} msg{chat.message_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
