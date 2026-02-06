import React from 'react';
import { MessageSquare, User, Clock, Check, AlertCircle } from 'lucide-react';
import { Annotation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AnnotationsListProps {
  annotations: Annotation[];
  showAll?: boolean;
}

const AnnotationsList: React.FC<AnnotationsListProps> = ({ 
  annotations, 
  showAll = false 
}) => {
  const { user } = useAuth();

  const getStatusIcon = (status: Annotation['status']) => {
    switch (status) {
      case 'Approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Pending Approval':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Draft':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Annotation['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Annotation['type']) => {
    switch (type) {
      case 'Personal':
        return 'bg-blue-100 text-blue-800';
      case 'Team Shared':
        return 'bg-purple-100 text-purple-800';
      case 'Knowledge Base':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter annotations based on user permissions and showAll flag
  const visibleAnnotations = annotations.filter(annotation => {
    if (showAll) return true;
    
    // Always show user's own annotations
    if (annotation.user_id === user?.id) return true;
    
    // Show approved team shared and knowledge base annotations
    if (annotation.status === 'Approved' && annotation.type !== 'Personal') return true;
    
    return false;
  });

  if (visibleAnnotations.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No annotations yet.</p>
        <p className="text-xs">Select text to add the first annotation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center">
        <MessageSquare className="h-4 w-4 mr-2" />
        Annotations ({visibleAnnotations.length})
      </h4>
      
      {visibleAnnotations.map((annotation) => (
        <div key={annotation.id} className="p-3 border rounded-lg bg-gray-50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {annotation.user_name}
                {annotation.user_id === user?.id && (
                  <span className="text-xs text-blue-600 ml-1">(You)</span>
                )}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(annotation.type)}`}>
                {annotation.type}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(annotation.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(annotation.status)}`}>
                  {annotation.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-xs text-gray-600 mb-1">Selected text:</div>
            <div className="text-sm bg-white p-2 rounded border italic">
              "{annotation.text_selection}"
            </div>
          </div>
          
          <div className="text-sm text-gray-700 mb-2">
            {annotation.note}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {new Date(annotation.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            {annotation.approved_at && (
              <span className="text-green-600">
                Approved {new Date(annotation.approved_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnotationsList;