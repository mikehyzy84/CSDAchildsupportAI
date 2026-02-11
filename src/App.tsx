import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Documents from './pages/Documents';
import PolicyDetail from './pages/PolicyDetail';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import ReportPreview from './pages/ReportPreview';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './styles/california-theme.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public route - Login */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="chat" element={
                  <ErrorBoundary>
                    <Chat />
                  </ErrorBoundary>
                } />
                <Route path="documents" element={<Documents />} />
                <Route path="policy/:id" element={<PolicyDetail />} />
                <Route path="reports" element={<Reports />} />
                <Route path="report-preview" element={<ReportPreview />} />
                <Route path="profile" element={<Profile />} />

                {/* Admin route - requires Admin or Manager role */}
                <Route path="admin" element={
                  <ProtectedRoute requiredRoles={['Admin', 'Manager']}>
                    <Admin />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;