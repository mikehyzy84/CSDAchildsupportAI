import React, { useState } from 'react';
import Analytics from './Analytics';
import UserManagement from './UserManagement';
import DocumentManager from './DocumentManager';
import { BarChart3, Users, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'documents'>('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: Analytics },
    { id: 'users', label: 'User Management', icon: Users, component: UserManagement },
    { id: 'documents', label: 'Document Management', icon: FileText, component: DocumentManager }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Analytics;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-csdai-navy mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage system analytics, users, and policy documents
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === id
                    ? 'border-csdai-sky text-csdai-sky'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Dashboard;