import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../components/Admin/Dashboard';
import { useAuth } from '../contexts/AuthContext';

const Admin: React.FC = () => {
  const { hasRole } = useAuth();

  if (!hasRole(['Manager', 'Admin'])) {
    return <Navigate to="/" replace />;
  }

  return <Dashboard />;
};

export default Admin;