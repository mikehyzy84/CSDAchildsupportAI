import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, Building2, FileText } from 'lucide-react';
import { samplePolicies } from '../data/mockData';
import { generateCitation } from '../utils/citationGenerator';
import { useAnnotations } from '../hooks/useAnnotations';
import AnnotationForm from '../components/Annotations/AnnotationForm';
import AnnotationsList from '../components/Annotations/AnnotationsList';

const PolicyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');

  const policy = samplePolicies.find(p => p.id === id);
  const { getAnnotationsForPolicy } = useAnnotations();
  const annotations = getAnnotationsForPolicy(id || '');

  if (!policy) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Policy Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setShowAnnotationForm(true);
    }
  };

  const handleAnnotationSuccess = () => {
    setSelectedText('');
    setShowAnnotationForm(false);
  };

  const handleAnnotationCancel = () => {
    setSelectedText('');
    setShowAnnotationForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/search"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Results</span>
            </Link>
            
            <div className="ma-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{policy.title}</h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{policy.document_number}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Effective: {formatDate(policy.effective_date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{policy.source === 'California' ? 'CA DCSS' : 'Federal OCSE'}</span>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    policy.source === 'California' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {policy.source}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="ma-btn-outline text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                  
                  <button className="ma-btn-outline text-sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Content */}
          <div className="ma-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Policy Content</h2>
            
            <div 
              className="prose prose-blue max-w-none leading-relaxed text-gray-700"
              onMouseUp={handleTextSelection}
            >
              {policy.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Citation Generator */}
          <div className="ma-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citation Format
              </label>
              <select
                value={citationFormat}
                onChange={(e) => setCitationFormat(e.target.value as 'apa' | 'mla' | 'chicago')}
                className="ma-input max-w-xs"
              >
                <option value="apa">APA</option>
                <option value="mla">MLA</option>
                <option value="chicago">Chicago</option>
              </select>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {generateCitation(policy, citationFormat)}
              </pre>
            </div>
          </div>
        </div>

        {/* Annotations Sidebar */}
        <div className="w-80">
          <div className="sticky top-8">
            <div className="ma-card">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Annotations</h3>
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {showAnnotations ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              {showAnnotations && (
                <div className="p-4 space-y-4">
                  {/* Add Annotation Form */}
                  {selectedText && showAnnotationForm && (
                    <AnnotationForm
                      policyId={id || ''}
                      selectedText={selectedText}
                      onCancel={handleAnnotationCancel}
                      onSuccess={handleAnnotationSuccess}
                    />
                  )}
                  
                  {/* Existing Annotations */}
                  <AnnotationsList annotations={annotations} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetail;