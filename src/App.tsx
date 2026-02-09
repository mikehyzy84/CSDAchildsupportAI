import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import VoiceChat from './pages/VoiceChat';
import Documents from './pages/Documents';
import PolicyDetail from './pages/PolicyDetail';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import ReportPreview from './pages/ReportPreview';
import RoleSelector from './components/Auth/RoleSelector';
import { AuthProvider } from './contexts/AuthContext';
import './styles/california-theme.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <RoleSelector />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<VoiceChat />} />
                <Route path="documents" element={<Documents />} />
                <Route path="policy/:id" element={<PolicyDetail />} />
                <Route path="admin" element={<Admin />} />
                <Route path="reports" element={<Reports />} />
                <Route path="report-preview" element={<ReportPreview />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;