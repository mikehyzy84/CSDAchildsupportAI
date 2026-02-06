import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Building2, Star, FileText, MessageSquare } from 'lucide-react';
import { Policy } from '../../types';
import { highlightSearchTerms } from '../../utils/searchEngine';
import { useAnnotations } from '../../hooks/useAnnotations';

interface PolicyCardProps {
  policy: Policy;
  searchQuery: string;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, searchQuery }) => {
  const { getAnnotationsForPolicy } = useAnnotations();
  const annotations = getAnnotationsForPolicy(policy.id);
  const approvedAnnotations = annotations.filter(a => a.status === 'Approved');

  const getExcerpt = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    
    const excerpt = content.substring(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(' ');
    return excerpt.substring(0, lastSpace) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSourceColor = (source: string) => {
    return source === 'California' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getRelevanceStars = (score: number) => {
    const stars = Math.round(score * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="ma-card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(policy.source)}`}>
              {policy.source}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
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
          
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">Relevance:</span>
            <div className="flex items-center space-x-1">
              {getRelevanceStars(policy.relevance_score)}
            </div>
            <span className="text-sm text-gray-500">
              ({(policy.relevance_score * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Content Excerpt */}
      <div 
        className="text-gray-700 mb-4 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: highlightSearchTerms(getExcerpt(policy.content), searchQuery)
        }}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Link
            to={`/policy/${policy.id}`}
            className="ma-btn-primary text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Full Policy
          </Link>
          
          <Link
            to={`/policy/${policy.id}`}
            className="ma-btn-outline text-sm flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Annotations ({approvedAnnotations.length})
          </Link>
        </div>
        
        <a
          href={policy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Official Source</span>
        </a>
      </div>
    </div>
  );
};

export default PolicyCard;