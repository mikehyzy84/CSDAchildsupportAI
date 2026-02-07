import React, { useState } from 'react';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import { samplePolicies } from '../../data/mockData';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useAuth } from '../../contexts/AuthContext';

const DocumentManager: React.FC = () => {
  const { getPendingAnnotations, approveAnnotation, rejectAnnotation } = useAnnotations();
  const { hasRole } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    document_number: '',
    source: 'Massachusetts' as 'Massachusetts' | 'Federal',
    effective_date: '',
    content: '',
    url: ''
  });

  const pendingAnnotations = getPendingAnnotations();
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock upload
    alert('Document uploaded successfully!');
    setUploadData({
      title: '',
      document_number: '',
      source: 'California',
      effective_date: '',
      content: '',
      url: ''
    });
    setShowUploadForm(false);
  };

  const handleApproveAnnotation = (id: string) => {
    approveAnnotation(id);
  };

  const handleRejectAnnotation = (id: string) => {
    if (confirm('Are you sure you want to reject this annotation? This action cannot be undone.')) {
      rejectAnnotation(id);
    }
  };

  // Only show annotation approval section to managers and admins
  const canApproveAnnotations = hasRole(['Manager', 'Admin']);

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="ma-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
            <p className="text-sm text-gray-600">Upload and manage policy documents</p>
          </div>
          
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="ma-btn-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Policy
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Policy</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Title</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="ma-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                  <input
                    type="text"
                    value={uploadData.document_number}
                    onChange={(e) => setUploadData({ ...uploadData, document_number: e.target.value })}
                    className="ma-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={uploadData.source}
                    onChange={(e) => setUploadData({ ...uploadData, source: e.target.value as 'California' | 'Federal' })}
                    className="ma-input"
                  >
                    <option value="California">California</option>
                    <option value="Federal">Federal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={uploadData.effective_date}
                    onChange={(e) => setUploadData({ ...uploadData, effective_date: e.target.value })}
                    className="ma-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official URL</label>
                <input
                  type="url"
                  value={uploadData.url}
                  onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                  className="ma-input"
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Content</label>
                <textarea
                  value={uploadData.content}
                  onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                  className="ma-input h-32"
                  placeholder="Enter the full policy text..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className="ma-btn-primary">
                  Upload Policy
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="ma-btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Pending Annotations */}
      {canApproveAnnotations && (
        <div className="ma-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Annotations</h3>
              <p className="text-sm text-gray-600">
                {pendingAnnotations.length} annotations awaiting approval
              </p>
            </div>
          </div>

          {pendingAnnotations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No pending annotations. All annotations are up to date!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAnnotations.map((annotation) => (
                <div key={annotation.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{annotation.user_name}</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                          {annotation.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Policy: {samplePolicies.find(p => p.id === annotation.policy_id)?.title}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApproveAnnotation(annotation.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-3 w-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectAnnotation(annotation.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-medium mb-1">Selected Text:</p>
                    <div className="bg-white p-3 rounded border text-sm italic">
                      "{annotation.text_selection}"
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700 font-medium mb-1">Annotation:</p>
                    <div className="bg-white p-3 rounded border text-sm">
                      {annotation.note}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Submitted: {new Date(annotation.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Updates */}
      <div className="ma-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Policy Updates</h3>
        
        <div className="space-y-4">
          {samplePolicies.slice(0, 5).map((policy) => (
            <div key={policy.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-csdai-sky" />
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{policy.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{policy.document_number}</span>
                  <span>•</span>
                  <span>{policy.source}</span>
                  <span>•</span>
                  <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <span className="px-2 py-1 bg-csdai-emerald/20 text-csdai-emerald rounded-full text-xs font-medium">
                  Current
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;