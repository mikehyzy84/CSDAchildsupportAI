import { useState, useContext, createContext, ReactNode } from 'react';
import { User } from '../types';
import { sampleUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  hasRole: (role: User['role'] | User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(sampleUsers[1]);

  const login = (role: User['role']) => {
    const userData = sampleUsers.find(u => u.role === role) || sampleUsers[1];
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (roles: User['role'] | User['role'][]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
