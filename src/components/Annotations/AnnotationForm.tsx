import React, { useState } from 'react';
import { MessageSquare, X, Check } from 'lucide-react';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useAuth } from '../../contexts/AuthContext';

interface AnnotationFormProps {
  policyId: string;
  selectedText: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({
  policyId,
  selectedText,
  onCancel,
  onSuccess
}) => {
  const [note, setNote] = useState('');
  const [type, setType] = useState<'Personal' | 'Team Shared' | 'Knowledge Base'>('Team Shared');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAnnotation } = useAnnotations();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !selectedText.trim()) return;

    setIsSubmitting(true);
    
    try {
      const annotation = addAnnotation(policyId, selectedText, note.trim(), type);
      
      if (annotation) {
        // Show success message based on type
        const message = type === 'Personal' 
          ? 'Personal annotation added successfully!'
          : 'Annotation submitted for manager approval!';
        
        alert(message);
        onSuccess();
      }
    } catch {
      alert('Failed to add annotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">You must be logged in to add annotations.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Annotation
        </h4>
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Selected Text
          </label>
          <div className="p-2 bg-white rounded border text-sm max-h-20 overflow-y-auto">
            "{selectedText}"
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Annotation Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Personal">Personal Note (immediate)</option>
            <option value="Team Shared">Team Shared (requires approval)</option>
            <option value="Knowledge Base">Knowledge Base (requires approval)</option>
          </select>
          <p className="text-xs text-blue-600 mt-1">
            {type === 'Personal' 
              ? 'Only you can see this annotation'
              : 'Will be submitted to managers for approval'
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Your Annotation
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add your note, clarification, or insight about this policy text..."
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={!note.trim() || isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            <span>{isSubmitting ? 'Adding...' : 'Add Annotation'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnotationForm;