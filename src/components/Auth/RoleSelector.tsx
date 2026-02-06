import { Shield, Users, Settings, Crown } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const RoleSelector: React.FC = () => {
  const { user, login } = useAuth();

  const roles: Array<{ role: User['role']; icon: React.ComponentType; color: string; description: string }> = [
    { role: 'Worker', icon: Users, color: 'blue', description: 'Standard user access' },
    { role: 'Supervisor', icon: Shield, color: 'green', description: 'Can approve annotations' },
    { role: 'Manager', icon: Settings, color: 'purple', description: 'Access to admin dashboard' },
    { role: 'Admin', icon: Crown, color: 'red', description: 'Full system access' }
  ];

  if (user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Role</h2>
          <p className="text-gray-600">Choose a role to access the system (POC Demo)</p>
        </div>

        <div className="space-y-3">
          {roles.map(({ role, icon: Icon, color, description }) => (
            <button
              key={role}
              onClick={() => login(role)}
              className={`w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-${color}-300 hover:bg-${color}-50 transition-colors duration-200`}
            >
              <div className={`flex-shrink-0 w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{role}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          This is a proof-of-concept demo. In production, authentication would be handled by your organization's identity system.
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;